/* eslint-disable no-sync */

import * as fs from 'fs';
import * as path from 'path';

interface TemplateValues {
  awsResource: string;
  awsService: string;
  blockType: string;
  className: string;
  fileName: string;
  argName: string;
}

const fillCommandTemplate = ({
  awsService,
  awsResource,
  blockType,
  className,
  fileName,
  argName
}: TemplateValues): string => {
  return `
import type * as Parser from '@oclif/parser';
import { build${awsService}${awsResource}Resource } from '@src/builders';
import { collect${awsService}${awsResource}Details } from '@src/collectors';
import { TFBlock, TFBlocks } from '@src/types';
import { AwsResourceType, BaseNadoCommand, ParseResults } from '@src/utils';

interface CommandArgs {
  ${argName}?: string;
}

export class ${className} extends BaseNadoCommand {
  public static description =
    'Generates Terraform configuration for an ${awsService} ${awsResource}.';

  public static examples = [
    '$ terra ${fileName} [${argName}]',
    '$ terra ${fileName}'
  ];

  public static flags = BaseNadoCommand.flags;

  public static args: Parser.args.IArg[] = [
    { name: '${argName}', required: false } //
  ];

  protected _defaultFilenamePrefix = '${awsResource.toLowerCase()}';
  protected _primaryResourceBlockType = AwsResourceType.${blockType};

  protected _parse(): ParseResults {
    return this.parse(${className});
  }

  protected async _nadoResource({
    ${argName}
  }: CommandArgs): Promise<TFBlock[]> {
    this.log(
      ${argName}
        ? \`Preparing to generate Terraform configuration for ${awsResource} \${${argName}}\`
        : \`Preparing to generate Terraform configuration for ${awsResource}s\`
    );

    const blocks: TFBlocks = [];
    const ${awsResource.toLowerCase()}Details = await collect${awsService}${awsResource}Details(${argName});

    blocks.push(...${awsResource.toLowerCase()}Details.map(build${awsService}${awsResource}Resource));

    return blocks;
  }
}`.trim();
};

console.log(process.argv);

const [
  ,
  ,
  fileName,
  className,
  argName,
  blockType,
  awsService,
  awsResource
] = process.argv;

const throwIfEmpty = (str: string | undefined, message: string): void => {
  if (!str) {
    throw new Error(message);
  }
};

throwIfEmpty(fileName, 'first argument must be file name');
throwIfEmpty(className, 'second argument must be class name');
throwIfEmpty(argName, 'third argument must be arg name');
throwIfEmpty(awsService, 'forth argument must be aws service');
throwIfEmpty(awsResource, 'fifth argument must be aws resource');
throwIfEmpty(blockType, 'sixth argument must be block type');

// const classContents = fillCommandTemplate({
//   fileName,
//   awsResource: '',
//   awsService: '',
//   blockType: 'AWS_EIP_ASSOCIATION',
//   className: 'AwsIamGroup',
//   argName: 'groupName'
// });

const classContents = fillCommandTemplate({
  fileName,
  className,
  argName,
  blockType,
  awsService,
  awsResource
});

fs.writeFileSync(
  path.join('src', 'commands', `${fileName}.ts`),
  `${classContents}\n`
);

// example usage: nrun tools:generate-aws-port-command aws_ec2_elasticip AwsEc2ElasticIP allocationId AWS_EIP EC2 ElasticIP
