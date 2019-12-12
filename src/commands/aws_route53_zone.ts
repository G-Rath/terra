import { Command, flags } from '@oclif/command';
import * as Parser from '@oclif/parser';
import { nadoRoute53Zone } from '@src/nados';
import { TFNodeType } from '@src/types';
import { AwsResourceType } from '@src/utils';

export default class AwsRoute53Zone extends Command {
  static description = 'Generates Terraform configuration for a Route53 Zone';

  static examples = [
    `$ terra aws_route53_zone /hostedzone/123456789
hello world from ./src/hello.ts!
`
  ];

  static flags = {
    greedy: flags.boolean({
      description:
        'if true, will greedily nado configuration for related resources, such as records',
      default: false,
      char: 'g'
    })
  };

  static args: Parser.args.IArg[] = [
    { name: 'zoneId', required: true } //
  ];

  async run() {
    const {
      args: { zoneId },
      flags: { greedy }
    } = this.parse(AwsRoute53Zone);

    console.log(
      `Preparing to port "${zoneId}", with${greedy ? '' : 'out'} records`
    );
    const tfRoot = await nadoRoute53Zone(zoneId, greedy);

    const zoneResource = tfRoot.find(
      block =>
        block.type === TFNodeType.Resource &&
        block.resource === AwsResourceType.AWS_ROUTE53_ZONE
    );

    if (!zoneResource) {
      throw new Error('assertion failure: "zoneResource" cannot be undefined');
    }

    const fileName = `route_${zoneResource.name}`;

    console.log(fileName);
  }
}
