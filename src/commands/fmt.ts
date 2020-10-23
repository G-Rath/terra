import { Command, flags } from '@oclif/command';
import type * as Parser from '@oclif/parser';
import { format } from '@src/formatter';
import {
  DiscardSurroundingTextBehaviour,
  discardSurroundingText
} from '@src/formatter';
import { parseTFFileContents } from '@src/parser';
import { printTFFileContents } from '@src/printer';
import dedent from 'dedent';
import * as disparity from 'disparity';
import { promises as fs } from 'fs';

export class Fmt extends Command {
  public static description = 'Formats the given input';

  public static examples = [`$ terra fmt <file>`];

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
    diff: flags.boolean({
      description: dedent`
      [default: false]

      Print a patch showing the difference between the input & output.
      `,
      allowNo: true,
      default: false,
      char: 'd'
    }),
    write: flags.boolean({
      description: dedent`
      [default: false]

      Write the formatted output back to disk.
      `,
      allowNo: true,
      default: false,
      char: 'w'
    }),
    discardSurroundingText: flags.enum<
      DiscardSurroundingTextBehaviour | 'none'
    >({
      options: [
        'none',
        'except-comments',
        'except-comments-and-newlines',
        'all'
      ],
      description: dedent`\n
        Specifies the behaviour when discarding surrounding text.
        This useful for ensuring completely consistent formatting.

        One of four different behaviours can be specified:

        'none': No surrounding text is discarded - useful for ensuring no discarding takes place.
        'except-comments': only surrounding text containing comments will be kept
        'except-comments-and-newlines': only surrounding text containing either at
                                        least one newline, or a comment will be kept
      `,
      default: 'none',
      required: false
    })
  };

  public static strict = false;

  public static aliases = ['format'];

  public static args: Parser.args.IArg[] = [
    {
      name: 'filePath',
      required: true,
      description: 'list of files to format'
    }
  ];

  public async run(): Promise<void> {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      args: { filePath },
      flags: {
        diff: shouldDiff, //
        write: shouldWrite,
        format: shouldFormat,
        discardSurroundingText: discardSurroundingTextBehaviour
      }
    } = this.parse(Fmt);

    // // have to use raw for variadic args
    // const files: string[] = raw.filter(r => r.type === 'arg').map(r => r.input);
    // console.log(files);

    const input = (await fs.readFile(filePath)).toString();

    let contents = parseTFFileContents(input);

    if (discardSurroundingTextBehaviour !== 'none') {
      contents = discardSurroundingText(
        contents,
        discardSurroundingTextBehaviour
      );
    }

    if (shouldFormat) {
      contents = format(contents);
    }

    const output = printTFFileContents(contents);

    if (shouldDiff) {
      this._printDiff(filePath, input, output);
    }

    if (shouldWrite) {
      await fs.writeFile(filePath, output);
    }
  }

  private _printDiff(filePath: string, input: string, output: string): void {
    const diff = disparity.unified(input, output, {
      paths: [filePath, '']
    });

    this.log(diff || `${filePath} is already formatted`);
  }
}
