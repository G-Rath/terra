import { makeTFListExpression, makeTFSimpleLiteral } from '@src/makers';
import * as printer from '@src/printer';
import * as printers from '@src/printers';
import { printLiteralExpression } from '@src/printers';
import { TFNodeType } from '@src/types';

describe('printLiteralExpression', () => {
  describe('when literal is Simple', () => {
    it('prints as expected', () => {
      expect(
        printLiteralExpression(makeTFSimpleLiteral('1'))
      ).toMatchInlineSnapshot(`"1"`);
    });

    it('uses printTFListExpression', () => {
      const printTFSimpleLiteralSpy = jest.spyOn(
        printer,
        'printTFSimpleLiteral'
      );

      const simpleLiteral = makeTFSimpleLiteral('1');

      printLiteralExpression(simpleLiteral);

      expect(printTFSimpleLiteralSpy).toHaveBeenCalledWith(simpleLiteral);
    });
  });

  describe('when literal is an array', () => {
    it('prints a single simple element correctly', () => {
      expect(
        printLiteralExpression([
          makeTFSimpleLiteral('aws_route53_zone.my_zone.name')
        ])
      ).toMatchInlineSnapshot(`
        "[
          aws_route53_zone.my_zone.name
        ]"
      `);
    });

    it('prints multiple simple elements correctly', () => {
      expect(
        printLiteralExpression(
          [
            'aws_route53_zone.my_zone.name_servers.0',
            'aws_route53_zone.my_zone.name_servers.1',
            'aws_route53_zone.my_zone.name_servers.2',
            'aws_route53_zone.my_zone.name_servers.3'
          ].map(v => makeTFSimpleLiteral(v))
        )
      ).toMatchInlineSnapshot(`
        "[
          aws_route53_zone.my_zone.name_servers.0,
          aws_route53_zone.my_zone.name_servers.1,
          aws_route53_zone.my_zone.name_servers.2,
          aws_route53_zone.my_zone.name_servers.3
        ]"
      `);
    });

    it('prints nested arrays correctly', () => {
      expect(
        printLiteralExpression([
          [
            'aws_subnet.private_a.id',
            'aws_subnet.private_b.id',
            'aws_subnet.private_c.id'
          ].map(v => makeTFSimpleLiteral(v)),
          [
            'aws_subnet.public_a.id',
            'aws_subnet.public_b.id',
            'aws_subnet.public_c.id'
          ].map(v => makeTFSimpleLiteral(v))
        ])
      ).toMatchInlineSnapshot(`
        "[
          [
            aws_subnet.private_a.id,
            aws_subnet.private_b.id,
            aws_subnet.private_c.id
          ],
          [
            aws_subnet.public_a.id,
            aws_subnet.public_b.id,
            aws_subnet.public_c.id
          ]
        ]"
      `);
    });

    it('prints map elements correctly', () => {
      expect(
        printLiteralExpression([
          {
            type: TFNodeType.Map,
            attributes: [
              ['Name', makeTFSimpleLiteral('"MyName"')],
              ['TTL', makeTFSimpleLiteral('300')]
            ]
          }
        ])
      ).toMatchInlineSnapshot(`
        "[
          {
            Name = \\"MyName\\"
            TTL = 300
          }
        ]"
      `);
    });

    it('prints function elements correctly', () => {
      // todo: functions not yet supported properly
      expect(
        printLiteralExpression([
          [
            'aws_subnet.private_a.id',
            'aws_subnet.private_b.id',
            'aws_subnet.private_c.id'
          ].map(v => makeTFSimpleLiteral(v)),
          {
            type: TFNodeType.Function,
            name: 'map',
            args: []
          }
        ])
      ).toMatchInlineSnapshot(`
        "[
          [
            aws_subnet.private_a.id,
            aws_subnet.private_b.id,
            aws_subnet.private_c.id
          ],
          map(
            # FIXME - FUNCTIONS NOT YET SUPPORTED
          )
        ]"
      `);
    });

    it('prints mixed elements correctly', () => {
      expect(
        printLiteralExpression([
          [
            'aws_subnet.private_a.id',
            'aws_subnet.private_b.id',
            'aws_subnet.private_c.id'
          ].map(v => makeTFSimpleLiteral(v)),
          makeTFSimpleLiteral('true'),
          makeTFSimpleLiteral('300'),
          {
            type: TFNodeType.Map,
            attributes: [
              [
                'MyMap',
                {
                  type: TFNodeType.Map,
                  attributes: [
                    ['Enabled', makeTFSimpleLiteral('false')],
                    ['TTL', makeTFSimpleLiteral('300')],
                    [
                      'MyArray',
                      [
                        'aws_subnet.public_a.id',
                        'aws_subnet.public_b.id',
                        'aws_subnet.public_c.id'
                      ].map(v => makeTFSimpleLiteral(v))
                    ]
                  ]
                }
              ]
            ]
          }
        ])
      ).toMatchInlineSnapshot(`
        "[
          [
            aws_subnet.private_a.id,
            aws_subnet.private_b.id,
            aws_subnet.private_c.id
          ],
          true,
          300,
          {
            MyMap = {
              Enabled = false
              TTL = 300
              MyArray = [
                aws_subnet.public_a.id,
                aws_subnet.public_b.id,
                aws_subnet.public_c.id
              ]
            }
          }
        ]"
      `);
    });
  });

  describe('when expression is a List', () => {
    it('uses printTFListExpression', () => {
      const printTFListExpressionSpy = jest.spyOn(
        printers,
        'printTFListExpression'
      );

      const listExpression = makeTFListExpression([]);

      printLiteralExpression(listExpression);

      expect(printTFListExpressionSpy).toHaveBeenCalledWith(listExpression);
    });
  });

  describe('when literal is a Map', () => {
    it('prints simple attributes correctly', () => {
      expect(
        printLiteralExpression({
          type: TFNodeType.Map,
          attributes: [
            ['Name', makeTFSimpleLiteral('"MyName"')], //
            ['TTL', makeTFSimpleLiteral('300')]
          ]
        })
      ).toMatchInlineSnapshot(`
        "{
          Name = \\"MyName\\"
          TTL = 300
        }"
      `);
    });

    it('prints array attributes correctly', () => {
      expect(
        printLiteralExpression({
          type: TFNodeType.Map,
          attributes: [
            [
              'MyArray',
              [
                'aws_subnet.public_a.id',
                'aws_subnet.public_b.id',
                'aws_subnet.public_c.id'
              ].map(v => makeTFSimpleLiteral(v))
            ]
          ]
        })
      ).toMatchInlineSnapshot(`
        "{
          MyArray = [
            aws_subnet.public_a.id,
            aws_subnet.public_b.id,
            aws_subnet.public_c.id
          ]
        }"
      `);
    });

    it('prints function attributes correctly', () => {
      expect(
        printLiteralExpression({
          type: TFNodeType.Map,
          attributes: [
            [
              'MyFunction',
              {
                type: TFNodeType.Function,
                name: 'flatten',
                args: [
                  [
                    'MyArray',
                    [
                      'aws_subnet.public_a.id',
                      'aws_subnet.public_b.id',
                      'aws_subnet.public_c.id'
                    ]
                  ]
                ]
              }
            ]
          ]
        })
      ).toMatchInlineSnapshot(`
        "{
          MyFunction = flatten(
            # FIXME - FUNCTIONS NOT YET SUPPORTED
          )
        }"
      `);
    });

    it('prints shallow maps correctly', () => {
      expect(
        printLiteralExpression({
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
      ).toMatchInlineSnapshot(`
        "{
          MyMap = {
            Name = \\"MyName\\"
            TTL = 300
          }
        }"
      `);
    });

    it('prints nested maps correctly', () => {
      expect(
        printLiteralExpression({
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
      ).toMatchInlineSnapshot(`
        "{
          MyMap = {
            Name = \\"MyName\\"
            TTL = 300
          }
        }"
      `);
    });

    it('prints a mixed map correctly', () => {
      expect(
        printLiteralExpression({
          type: TFNodeType.Map,
          attributes: [
            [
              'MyMap',
              {
                type: TFNodeType.Map,
                attributes: [
                  ['Enabled', makeTFSimpleLiteral('false')],
                  ['TTL', makeTFSimpleLiteral('300')],
                  [
                    'MyArray',
                    [
                      'aws_subnet.public_a.id',
                      'aws_subnet.public_b.id',
                      'aws_subnet.public_c.id'
                    ].map(v => makeTFSimpleLiteral(v))
                  ]
                ]
              }
            ]
          ]
        })
      ).toMatchInlineSnapshot(`
        "{
          MyMap = {
            Enabled = false
            TTL = 300
            MyArray = [
              aws_subnet.public_a.id,
              aws_subnet.public_b.id,
              aws_subnet.public_c.id
            ]
          }
        }"
      `);
    });
  });
});
