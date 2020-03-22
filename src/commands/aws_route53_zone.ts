import { Command, flags } from '@oclif/command';
import type * as Parser from '@oclif/parser';
import { nadoRoute53Zone } from '@src/nados';
import type { TFResourceBlock } from '@src/types';
import { AwsResourceType } from '@src/utils';

export class AwsRoute53Zone extends Command {
  public static description =
    'Generates Terraform configuration for a Route53 Zone';

  public static examples = [
    `$ terra aws_route53_zone /hostedzone/123456789
hello world from ./src/hello.ts!
`
  ];

  public static flags = {
    greedy: flags.boolean({
      description:
        'if true, will greedily nado configuration for related resources, such as records',
      default: false,
      char: 'g'
    })
  };

  public static args: Parser.args.IArg[] = [
    { name: 'zoneId', required: true } //
  ];

  public async run(): Promise<void> {
    const {
      args: { zoneId },
      flags: { greedy }
    } = this.parse(AwsRoute53Zone);

    if (typeof zoneId !== 'string') {
      throw new Error(`zonId must be a string! Got ${typeof zoneId} instead`);
    }

    console.log(
      `Preparing to port "${zoneId}", with${greedy ? '' : 'out'} records`
    );
    const tfRoot = await nadoRoute53Zone(zoneId, greedy);

    const zoneResource = tfRoot.find(
      (block): block is TFResourceBlock =>
        block.blockType === 'resource' &&
        block.labels[0].value === AwsResourceType.AWS_ROUTE53_ZONE
    );

    if (!zoneResource) {
      throw new Error('assertion failure: "zoneResource" cannot be undefined');
    }

    const fileName = `route_${zoneResource.labels[1].value}`;

    console.log(fileName);
  }
}
