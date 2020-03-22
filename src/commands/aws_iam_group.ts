import type * as Parser from '@oclif/parser';
import { buildIAMGroupResource } from '@src/builders';
import { collectIAMGroupDetails } from '@src/collectors';
import type { TFBlock, TFBlocks } from '@src/types';
import { AwsResourceType, BaseNadoCommand, ParseResults } from '@src/utils';
import * as path from 'path';

const COMMAND_NAME = path.parse(__filename).name;

interface CommandArgs {
  groupName?: string;
}

export class AwsIamGroup extends BaseNadoCommand {
  public static description =
    'Generates Terraform configuration for an IAM Group.';

  public static examples = [
    `$ terra ${COMMAND_NAME} [groupName]`,
    `$ terra ${COMMAND_NAME}`
  ];

  public static flags = BaseNadoCommand.flags;

  public static args: Parser.args.IArg[] = [
    { name: 'groupName', required: false } //
  ];

  protected _defaultFilenamePrefix = 'group';
  protected _primaryResourceBlockType = AwsResourceType.AWS_IAM_GROUP;

  protected _parse(): ParseResults {
    return this.parse(AwsIamGroup);
  }

  protected async _nadoResource({
    groupName
  }: CommandArgs): Promise<TFBlock[]> {
    this.log(
      groupName
        ? `Preparing to generate Terraform configuration for Group ${groupName}`
        : `Preparing to generate Terraform configuration for Groups`
    );

    const blocks: TFBlocks = [];
    const groupDetails = await collectIAMGroupDetails(groupName);

    blocks.push(...groupDetails.map(buildIAMGroupResource));

    return blocks;
  }
}
