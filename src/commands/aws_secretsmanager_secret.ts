import * as Parser from '@oclif/parser';
import { buildSecretsManagerSecretResource } from '@src/builders';
import { collectSecretsManagerSecretDetails } from '@src/collectors';
import { TFBlock, TFBlocks } from '@src/types';
import { AwsResourceType, BaseNadoCommand, ParseResults } from '@src/utils';
import * as path from 'path';

const COMMAND_NAME = path.parse(__filename).name;

interface CommandArgs {
  secretId?: string;
}

export class AwsSecretsManagerSecret extends BaseNadoCommand {
  public static description =
    'Generates Terraform configuration for a SecretsManager Secret.';

  public static examples = [
    `$ terra ${COMMAND_NAME} [secretId]`,
    `$ terra ${COMMAND_NAME}`
  ];

  public static flags = BaseNadoCommand.flags;

  public static args: Parser.args.IArg[] = [
    { name: 'secretId', required: false } //
  ];

  protected _defaultFilenamePrefix = 'secret';
  protected _primaryResourceBlockType =
    AwsResourceType.AWS_SECRETSMANAGER_SECRET;

  protected _parse(): ParseResults {
    return this.parse(AwsSecretsManagerSecret);
  }

  protected async _nadoResource({ secretId }: CommandArgs): Promise<TFBlock[]> {
    this.log(
      secretId
        ? `Preparing to generate Terraform configuration for Secret ${secretId}`
        : `Preparing to generate Terraform configuration for Secrets`
    );

    const blocks: TFBlocks = [];
    const secretDetails = await collectSecretsManagerSecretDetails(secretId);

    blocks.push(...secretDetails.map(buildSecretsManagerSecretResource));

    return blocks;
  }
}
