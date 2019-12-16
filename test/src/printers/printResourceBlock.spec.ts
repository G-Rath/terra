import {
  makeTFArgument,
  makeTFBlockLiteral,
  makeTFResourceBlock
} from '@src/makers';
import { printResourceBlock } from '@src/printers';
import { TFNodeType, TFResourceBlock } from '@src/types';
import { AwsResourceType } from '@src/utils';

describe('printResourceBlock', () => {
  it.each<TFResourceBlock>([
    makeTFResourceBlock(AwsResourceType.AWS_ROUTE53_ZONE, 'imnotcrazy_info', [
      makeTFArgument('name', '"imnotcrazy.info"'),
      makeTFArgument('tags', {
        type: TFNodeType.Function,
        name: 'merge',
        args: ['local.common_tags']
      })
    ]),
    makeTFResourceBlock(
      AwsResourceType.AWS_ROUTE53_RECORD,
      'imnotcrazy_info_ns',
      [
        ...([
          ['allow_overwrite', 'true'],
          ['name', '""'],
          ['ttl', '300'],
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
    ),
    makeTFResourceBlock(
      AwsResourceType.AWS_CLOUDFRONT_DISTRIBUTION,
      'distribution',
      [
        makeTFArgument('allowed_methods', ['"GET"', '"HEAD"']),
        makeTFArgument('cached_methods', ['"GET"', '"HEAD"']),
        ...([
          ['compress', 'true'],
          ['default_ttl', '31536000'],
          ['max_ttl', '31536000'],
          ['min_ttl', '0'],
          ['path_pattern', '"/static/*"'],
          ['smooth_streaming', 'false'],
          ['target_origin_id', '"S3-app.mine/test"'],
          ['viewer_protocol_policy', '"https-only"']
        ] as const).map(([identifier, expression]) =>
          makeTFArgument(identifier, expression)
        ),
        makeTFArgument('trusted_signers', []),
        makeTFBlockLiteral('forwarded_values', [
          makeTFArgument('headers', []),
          makeTFArgument('query_string', 'false'),
          makeTFArgument('query_string_cache_keys', []),
          makeTFBlockLiteral('cookies', [
            makeTFArgument('forward', '"none"'),
            makeTFArgument('whitelisted_names', [])
          ])
        ])
      ]
    )
  ])('prints as expected', resourceBlock => {
    expect(printResourceBlock(resourceBlock)).toMatchSnapshot();
  });
});
