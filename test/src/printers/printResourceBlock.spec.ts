import { makeTFArgument } from '@src/makers';
import { printResourceBlock } from '@src/printers';
import { TFNodeType, TFResourceBlock } from '@src/types';
import { AwsResourceType } from '@src/utils';

describe('printResourceBlock', () => {
  it.each<TFResourceBlock>([
    {
      type: TFNodeType.Resource,
      resource: AwsResourceType.AWS_ROUTE53_ZONE,
      name: 'imnotcrazy_info',
      body: [
        makeTFArgument('name', '"imnotcrazy.info"'),
        makeTFArgument('tags', {
          type: TFNodeType.Function,
          name: 'merge',
          args: ['local.common_tags']
        })
      ]
    },
    {
      type: TFNodeType.Resource,
      resource: AwsResourceType.AWS_ROUTE53_RECORD,
      name: 'imnotcrazy_info_ns',
      body: [
        ...([
          ['allow_overwrite', true],
          ['name', '""'],
          ['ttl', 300],
          ['type', '"NS"'],
          ['zone_id', 'aws_route53_zone.imnotcrazy_info.zone_id']
        ] as const).map(([identifier, expression]) =>
          makeTFArgument(identifier, expression)
        ),
        makeTFArgument('records', [
          'aws_route53_zone.imnotcrazy_info.name_servers.0',
          'aws_route53_zone.imnotcrazy_info.name_servers.1',
          'aws_route53_zone.imnotcrazy_info.name_servers.2',
          'aws_route53_zone.imnotcrazy_info.name_servers.3'
        ])
      ]
    },
    {
      type: TFNodeType.Resource,
      name: 'distribution',
      resource: AwsResourceType.AWS_CLOUDFRONT_DISTRIBUTION,
      body: [
        makeTFArgument('allowed_methods', ['"GET"', '"HEAD"']),
        makeTFArgument('cached_methods', ['"GET"', '"HEAD"']),
        ...([
          ['compress', true],
          ['default_ttl', 31536000],
          ['max_ttl', 31536000],
          ['min_ttl', 0],
          ['path_pattern', '"/static/*"'],
          ['smooth_streaming', false],
          ['target_origin_id', '"S3-app.mine/test"'],
          ['viewer_protocol_policy', '"https-only"']
        ] as const).map(([identifier, expression]) =>
          makeTFArgument(identifier, expression)
        ),
        makeTFArgument('trusted_signers', []),
        {
          type: TFNodeType.Block,
          name: 'forwarded_values',
          body: [
            makeTFArgument('headers', []),
            makeTFArgument('query_string', false),
            makeTFArgument('query_string_cache_keys', []),
            {
              type: TFNodeType.Block,
              name: 'cookies',
              body: [
                makeTFArgument('forward', '"none"'),
                makeTFArgument('whitelisted_names', [])
              ]
            }
          ]
        }
      ]
    }
  ])('prints as expected', resourceBlock => {
    expect(printResourceBlock(resourceBlock)).toMatchSnapshot();
  });
});
