import { printBlockBody } from '@src/printers';
import { TFNodeType } from '@src/types';

describe('printBlockBody', () => {
  describe('when the body contains no elements', () => {
    it('prints empty braces on one line', () => {
      expect(printBlockBody([])).toMatchSnapshot();
    });
  });

  describe('when the body contains a single element', () => {
    describe('when the element is an argument', () => {
      it('prints as expected', () => {
        expect(
          printBlockBody([
            {
              type: TFNodeType.Argument,
              identifier: 'hello',
              expression: '"world"'
            }
          ])
        ).toMatchSnapshot();
      });
    });

    describe('when the element is a block', () => {
      it('prints as expected', () => {
        expect(
          printBlockBody([
            {
              type: TFNodeType.Block,
              name: 'ingress',
              body: [
                {
                  type: TFNodeType.Argument,
                  identifier: 'from_port',
                  expression: 0
                },
                {
                  type: TFNodeType.Argument,
                  identifier: 'to_port',
                  expression: 0
                },
                {
                  type: TFNodeType.Argument,
                  identifier: 'protocol',
                  expression: '"-1"'
                },
                {
                  type: TFNodeType.Argument,
                  identifier: 'security_groups',
                  expression: ['aws_security_group.wordpress_server.id']
                }
              ]
            }
          ])
        ).toMatchSnapshot();
      });
    });

    describe('when the element is a dynamic', () => {
      it('prints as expected', () => {
        expect(
          printBlockBody([
            {
              type: TFNodeType.Dynamic,
              forEach: 'aws_nat_gateway.nat_gws',
              name: 'route',
              labels: [],
              content: [
                {
                  type: TFNodeType.Argument,
                  identifier: 'cidr_block',
                  expression: '"0.0.0.0/0"'
                },
                {
                  type: TFNodeType.Argument,
                  identifier: 'nat_gateway_id',
                  expression: 'route.value.id'
                }
              ]
            }
          ])
        ).toMatchSnapshot();
      });
    });
  });
  describe('when the body contains multiple elements', () => {
    describe('when the elements are just arguments', () => {
      it('prints as expected', () => {
        expect(
          printBlockBody([
            {
              type: TFNodeType.Argument,
              identifier: 'hello',
              expression: '"world"'
            },
            {
              type: TFNodeType.Argument,
              identifier: 'enabled',
              expression: false
            },
            {
              type: TFNodeType.Argument,
              identifier: 'common_tags',
              expression: {
                type: TFNodeType.Map,
                attributes: [
                  [
                    'MyMap',
                    {
                      type: TFNodeType.Map,
                      attributes: [
                        ['Name', '"MyName"'], //
                        ['TTL', 300]
                      ]
                    }
                  ]
                ]
              }
            }
          ])
        ).toMatchSnapshot();
      });
    });

    describe('when the elements are just blocks', () => {
      it('prints as expected', () => {
        expect(
          printBlockBody([
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
            },
            {
              type: TFNodeType.Block,
              name: 'ingress',
              body: [
                {
                  type: TFNodeType.Argument,
                  identifier: 'from_port',
                  expression: 0
                },
                {
                  type: TFNodeType.Argument,
                  identifier: 'to_port',
                  expression: 0
                },
                {
                  type: TFNodeType.Argument,
                  identifier: 'protocol',
                  expression: '"-1"'
                },
                {
                  type: TFNodeType.Argument,
                  identifier: 'security_groups',
                  expression: ['aws_security_group.wordpress_server.id']
                }
              ]
            }
          ])
        ).toMatchSnapshot();
      });
    });

    describe('when the elements are just dynamics', () => {
      it('prints as expected', () => {
        expect(
          printBlockBody([
            {
              type: TFNodeType.Dynamic,
              forEach: 'aws_nat_gateway.nat_gws',
              name: 'route',
              labels: [],
              content: [
                {
                  type: TFNodeType.Argument,
                  identifier: 'cidr_block',
                  expression: '"0.0.0.0/0"'
                },
                {
                  type: TFNodeType.Argument,
                  identifier: 'nat_gateway_id',
                  expression: 'route.value.id'
                }
              ]
            },
            {
              type: TFNodeType.Dynamic,
              forEach: 'aws_nat_gateway.nat_gws',
              name: 'route',
              labels: [],
              content: [
                {
                  type: TFNodeType.Argument,
                  identifier: 'cidr_block',
                  expression: '"0.0.0.0/0"'
                },
                {
                  type: TFNodeType.Argument,
                  identifier: 'nat_gateway_id',
                  expression: 'route.value.id'
                }
              ]
            }
          ])
        ).toMatchSnapshot();
      });
    });

    describe('when the elements are a mix', () => {
      it('prints as expected', () => {
        expect(
          printBlockBody([
            {
              type: TFNodeType.Argument,
              identifier: 'allowed_methods',
              expression: ['GET', 'HEAD']
            },
            {
              type: TFNodeType.Argument,
              identifier: 'cached_methods',
              expression: ['GET', 'HEAD']
            },
            ...([
              ['compress', true],
              ['default_ttl', 31536000],
              ['max_ttl', 31536000],
              ['min_ttl', 0],
              ['path_pattern', '"/static/*"'],
              ['smooth_streaming', false],
              ['target_origin_id', '"S3-app.mine/test"'],
              ['viewer_protocol_policy', 'https-only']
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
          ])
        ).toMatchSnapshot();
      });
    });
  });
});
