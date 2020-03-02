import * as Parser from '@oclif/parser';
import { buildIAMUserResource } from '@src/builders';
import { collectIAMUserDetails } from '@src/collectors';
import { TFBlock, TFBlocks } from '@src/types';
import { AwsResourceType, BaseNadoCommand, ParseResults } from '@src/utils';
import * as path from 'path';

const COMMAND_NAME = path.parse(__filename).name;

interface CommandArgs {
  userName?: string;
}

export class AwsIamUser extends BaseNadoCommand {
  public static description =
    'Generates Terraform configuration for an IAM User.';

  public static examples = [
    `$ terra ${COMMAND_NAME} [userName]`,
    `$ terra ${COMMAND_NAME}`
  ];

  public static flags = BaseNadoCommand.flags;

  public static args: Parser.args.IArg[] = [
    { name: 'userName', required: false } //
  ];

  protected _defaultFilenamePrefix = 'user';
  protected _primaryResourceBlockType = AwsResourceType.AWS_IAM_USER;

  protected _parse(): ParseResults {
    return this.parse(AwsIamUser);
  }

  protected async _nadoResource({
    userName //
  }: CommandArgs): Promise<TFBlock[]> {
    this.log(
      userName
        ? `Preparing to generate Terraform configuration for User ${userName}`
        : `Preparing to generate Terraform configuration for Users`
    );

    const blocks: TFBlocks = [];
    const secretDetails = await collectIAMUserDetails(userName);

    blocks.push(...secretDetails.map(buildIAMUserResource));

    return blocks;
  }
}
