import {
  makeTFArgument,
  makeTFBlockLiteral,
  makeTFDynamicBlock,
  makeTFSimpleLiteral
} from '@src/makers';
import { printBlockBody } from '@src/printers';
import { TFNodeType } from '@src/types';

describe('printBlockBody', () => {
  describe('when the body contains no elements', () => {
    it('prints empty braces on one line', () => {
      expect(printBlockBody([])).toMatchInlineSnapshot(`"{}"`);
    });
  });

  describe('when the body contains a single element', () => {
    describe('when the element is an argument', () => {
      it('prints as expected', () => {
        expect(printBlockBody([makeTFArgument('hello', '"world"')]))
          .toMatchInlineSnapshot(`
          "{
            hello = \\"world\\"
          }"
        `);
      });
    });

    describe('when the element is a block', () => {
      it('prints as expected', () => {
        expect(
          printBlockBody([
            makeTFDynamicBlock('ingress', [
              makeTFArgument('from_port', '0'),
              makeTFArgument('to_port', '0'),
              makeTFArgument('protocol', '"-1"'),
              makeTFArgument('security_groups', [
                'aws_security_group.wordpress_server.id'
              ])
            ])
          ])
        ).toMatchInlineSnapshot(`
          "{
            # FIXME: dynamic is not yet supported
          }"
        `);
      });
    });

    describe('when the element is a dynamic', () => {
      it('prints as expected', () => {
        expect(
          printBlockBody([
            makeTFDynamicBlock('route', [
              makeTFArgument('cidr_block', '"0.0.0.0/0"'),
              makeTFArgument('nat_gateway_id', 'route.value.id')
            ])
          ])
        ).toMatchInlineSnapshot(`
          "{
            # FIXME: dynamic is not yet supported
          }"
        `);
      });
    });
  });
  describe('when the body contains multiple elements', () => {
    describe('when the elements are just arguments', () => {
      it('prints as expected', () => {
        expect(
          printBlockBody([
            makeTFArgument('hello', '"world"'),
            makeTFArgument('enabled', 'false'),
            makeTFArgument('common_tags', {
              type: TFNodeType.Map,
              attributes: [
                [
                  'MyMap',
                  {
                    type: TFNodeType.Map,
                    attributes: [
                      ['Name', makeTFSimpleLiteral('"MyName"')],
                      ['TTL', makeTFSimpleLiteral('300')]
                    ]
                  }
                ]
              ]
            })
          ])
        ).toMatchInlineSnapshot(`
          "{
            hello = \\"world\\"
            enabled = false
            common_tags = {
              MyMap = {
                Name = \\"MyName\\"
                TTL = 300
              }
            }
          }"
        `);
      });
    });

    describe('when the elements are just blocks', () => {
      it('prints as expected', () => {
        expect(
          printBlockBody([
            makeTFBlockLiteral('cookies', [
              makeTFArgument('forward', '"none"'),
              makeTFArgument('whitelisted_names', [])
            ]),
            makeTFBlockLiteral('ingress', [
              makeTFArgument('from_port', '0'),
              makeTFArgument('to_port', '0'),
              makeTFArgument('protocol', '"-1"'),
              makeTFArgument('security_groups', [
                'aws_security_group.wordpress_server.id'
              ])
            ])
          ])
        ).toMatchInlineSnapshot(`
          "{
            cookies {
              forward = \\"none\\"
              whitelisted_names = [

              ]
            }
            ingress {
              from_port = 0
              to_port = 0
              protocol = \\"-1\\"
              security_groups = [
                aws_security_group.wordpress_server.id
              ]
            }
          }"
        `);
      });
    });

    describe('when the elements are just dynamics', () => {
      it('prints as expected', () => {
        expect(
          printBlockBody([
            makeTFDynamicBlock('route', [
              makeTFArgument('cidr_block', '"0.0.0.0/0"'),
              makeTFArgument('nat_gateway_id', 'route.value.id')
            ]),
            makeTFDynamicBlock('route', [
              makeTFArgument('cidr_block', '"0.0.0.0/0"'),
              makeTFArgument('nat_gateway_id', 'route.value.id')
            ])
          ])
        ).toMatchInlineSnapshot(`
          "{
            # FIXME: dynamic is not yet supported
            # FIXME: dynamic is not yet supported
          }"
        `);
      });
    });

    describe('when the elements are a mix', () => {
      it('prints as expected', () => {
        expect(
          printBlockBody([
            makeTFArgument('allowed_methods', ['GET', 'HEAD']),
            makeTFArgument('cached_methods', ['GET', 'HEAD']),
            ...([
              ['compress', 'true'],
              ['default_ttl', '31536000'],
              ['max_ttl', '31536000'],
              ['min_ttl', '0'],
              ['path_pattern', '"/static/*"'],
              ['smooth_streaming', 'false'],
              ['target_origin_id', '"S3-app.mine/test"'],
              ['viewer_protocol_policy', 'https-only']
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
          ])
        ).toMatchInlineSnapshot(`
          "{
            allowed_methods = [
              GET,
              HEAD
            ]
            cached_methods = [
              GET,
              HEAD
            ]
            compress = true
            default_ttl = 31536000
            max_ttl = 31536000
            min_ttl = 0
            path_pattern = \\"/static/*\\"
            smooth_streaming = false
            target_origin_id = \\"S3-app.mine/test\\"
            viewer_protocol_policy = https-only
            trusted_signers = [

            ]
            forwarded_values {
              headers = [

              ]
              query_string = false
              query_string_cache_keys = [

              ]
              cookies {
                forward = \\"none\\"
                whitelisted_names = [

                ]
              }
            }
          }"
        `);
      });
    });
  });
});
