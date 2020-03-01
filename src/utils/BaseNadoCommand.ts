import { Command, flags } from '@oclif/command';
import { format } from '@src/formatter';
import { printTFFileContents } from '@src/printer';
import {
  DataType,
  TFBlock,
  TFBlocks,
  TFFileContents,
  TFResourceBlock
} from '@src/types';
import dedent from 'dedent';
import { promises as fs } from 'fs';

export interface ParseResults {
  args: Record<string, unknown>;
  flags: {
    format?: boolean;
    write?: boolean;
    filepath?: string;
  };
}

export abstract class BaseNadoCommand extends Command {
  public static flags = {
    format: flags.boolean({
      description: dedent`
      [default: true]

      Apply formatting to the given file.
      `,
      allowNo: true,
      default: true,
      char: 'F'
    }),
    write: flags.boolean({
      description: dedent`
      [default: false]

      Write the collected resources to disk.

      A filename can be provided using the --file flag.
      A sensible filename based off the collected resources will be used if one isn't provided.
      `,
      allowNo: true,
      default: false,
      char: 'w'
    }),
    filepath: flags.string({
      description: dedent`
      The name & path of the file to write the Terraform configuration to.

      If the file already exists, the configuration will be appended to the end
      of the file. Otherwise, a new file will be created.
      `,
      required: false,
      char: 'f',
      dependsOn: ['write']
    })
  };

  protected abstract _primaryResourceBlockType: DataType;
  protected abstract _defaultFilenamePrefix: string;

  protected abstract _parse(): ParseResults;

  protected abstract async _nadoResource(
    args: Record<string, unknown>
  ): Promise<TFBlock[]>;

  private _getNameOfFirstResourceBlockOfType(
    blocks: TFBlocks,
    type: DataType
  ): string {
    const resource = blocks.find(
      (block): block is TFResourceBlock =>
        block.blockType === 'resource' &&
        block.labels[0].value === type &&
        block.labels.length === 2 // jic
    );

    if (!resource) {
      throw new Error(`Cannot find block of type ${type}`);
    }

    return resource.labels[1].value;
  }

  protected _buildDefaultFilename(contents: TFFileContents): string {
    return `${
      this._defaultFilenamePrefix
    }_${this._getNameOfFirstResourceBlockOfType(
      contents.blocks,
      this._primaryResourceBlockType
    )}.tf`;
  }

  public async run(): Promise<void> {
    const {
      args,
      flags: {
        format: shouldFormat, //
        filepath: preferredFilePath,
        write: shouldWrite
      }
    } = this._parse();

    let contents: TFFileContents = {
      surroundingText: { leadingOuterText: '', trailingOuterText: '' },
      blocks: await this._nadoResource(args)
    };

    if (contents.blocks.length === 0) {
      return;
    }

    if (shouldFormat) {
      contents = format(contents);
    }

    const output = printTFFileContents(contents);

    if (shouldWrite) {
      const filePath =
        preferredFilePath ?? this._buildDefaultFilename(contents);

      await fs.appendFile(filePath, output);

      this.log(`Written resources to ${filePath}`);

      return;
    }

    this.log(output);
  }
}
