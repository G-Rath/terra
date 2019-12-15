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
              makeTFListExpression([
                'aws_subnet.public_a.id',
                'aws_subnet.public_b.id',
                'aws_subnet.public_c.id'
              ])
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
                    makeTFListExpression([
                      'aws_subnet.public_a.id',
                      'aws_subnet.public_b.id',
                      'aws_subnet.public_c.id'
                    ])
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
