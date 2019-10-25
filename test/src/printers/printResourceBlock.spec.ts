import { printResourceBlock } from '@src/printers';
import { TFArgument, TFNodeType, TFResourceBlock } from '@src/types';
import { AwsResourceType } from '@src/utils';

describe('printResourceBlock', () => {
  it.each<TFResourceBlock>([
    {
      type: TFNodeType.Resource,
      resource: AwsResourceType.AWS_ROUTE53_ZONE,
      name: 'imnotcrazy_info',
      body: [
        {
          type: TFNodeType.Argument,
          identifier: 'name',
          expression: '"imnotcrazy.info"'
        },
        {
          type: TFNodeType.Argument,
          identifier: 'tags',
          expression: {
            type: TFNodeType.Function,
            name: 'merge',
            args: ['local.common_tags']
          }
        }
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
        ] as const).map(
          ([identifier, expression]): TFArgument => ({
            type: TFNodeType.Argument as const,
            identifier,
            expression
          })
        ),
        {
          type: TFNodeType.Argument,
          identifier: 'records',
          expression: [
            'aws_route53_zone.imnotcrazy_info.name_servers.0',
            'aws_route53_zone.imnotcrazy_info.name_servers.1',
            'aws_route53_zone.imnotcrazy_info.name_servers.2',
            'aws_route53_zone.imnotcrazy_info.name_servers.3'
          ]
        }
      ]
    },
    {
      type: TFNodeType.Resource,
      name: 'distribution',
      resource: AwsResourceType.AWS_CLOUDFRONT_DISTRIBUTION,
      body: [
        {
          type: TFNodeType.Argument,
          identifier: 'allowed_methods',
          expression: ['"GET"', '"HEAD"']
        },
        {
          type: TFNodeType.Argument,
          identifier: 'cached_methods',
          expression: ['"GET"', '"HEAD"']
        },
        ...([
          ['compress', true],
          ['default_ttl', 31536000],
          ['max_ttl', 31536000],
          ['min_ttl', 0],
          ['path_pattern', '"/static/*"'],
          ['smooth_streaming', false],
          ['target_origin_id', '"S3-app.mine/test"'],
          ['viewer_protocol_policy', '"https-only"']
        ] as const).map(
          ([identifier, expression]): TFArgument => ({
            type: TFNodeType.Argument as const,
            identifier,
            expression
          })
        ),
        {
          type: TFNodeType.Argument,
          identifier: 'trusted_signers',
          expression: []
        },
        {
          type: TFNodeType.Block,
          name: 'forwarded_values',
          body: [
            {
              type: TFNodeType.Argument,
              identifier: 'headers',
              expression: []
            },
            {
              type: TFNodeType.Argument,
              identifier: 'query_string',
              expression: false
            },
            {
              type: TFNodeType.Argument,
              identifier: 'query_string_cache_keys',
              expression: []
            },
            {
              type: TFNodeType.Block,
              name: 'cookies',
              body: [
                {
                  type: TFNodeType.Argument,
                  identifier: 'forward',
                  expression: '"none"'
                },
                {
                  type: TFNodeType.Argument,
                  identifier: 'whitelisted_names',
                  expression: []
                }
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
