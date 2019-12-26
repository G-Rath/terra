import {
  makeTFAttribute,
  makeTFFunctionExpression,
  makeTFListExpression,
  makeTFMapExpression,
  makeTFSimpleLiteral
} from '@src/makers';
import * as printer from '@src/printer';
import { printTFLiteralExpression } from '@src/printer';

describe('printTFLiteralExpression', () => {
  describe('when literal is Simple', () => {
    it('prints as expected', () => {
      expect(
        printTFLiteralExpression(makeTFSimpleLiteral('1'))
      ).toMatchInlineSnapshot(`"1"`);
    });

    it('uses printTFListExpression', () => {
      const printTFSimpleLiteralSpy = jest.spyOn(
        printer,
        'printTFSimpleLiteral'
      );

      const simpleLiteral = makeTFSimpleLiteral('1');

      printTFLiteralExpression(simpleLiteral);

      expect(printTFSimpleLiteralSpy).toHaveBeenCalledWith(simpleLiteral);
    });
  });

  describe('when expression is a List', () => {
    it('uses printTFListExpression', () => {
      const printTFListExpressionSpy = jest.spyOn(
        printer,
        'printTFListExpression'
      );

      const listExpression = makeTFListExpression([]);

      printTFLiteralExpression(listExpression);

      expect(printTFListExpressionSpy).toHaveBeenCalledWith(listExpression);
    });
  });

  describe('when literal is a Map', () => {
    it('prints simple attributes correctly', () => {
      expect(
        printTFLiteralExpression(
          makeTFMapExpression(
            ([
              ['Name', makeTFSimpleLiteral('"MyName"')], //
              ['TTL', makeTFSimpleLiteral('300')]
            ] as const).map(value => makeTFAttribute(value[0], value[1]))
          )
        )
      ).toMatchInlineSnapshot(`"{Name=\\"MyName\\"TTL=300}"`);
    });

    it('prints array attributes correctly', () => {
      expect(
        printTFLiteralExpression(
          makeTFMapExpression([
            makeTFAttribute(
              'MyArray',
              makeTFListExpression([
                'aws_subnet.public_a.id',
                'aws_subnet.public_b.id',
                'aws_subnet.public_c.id'
              ])
            )
          ])
        )
      ).toMatchInlineSnapshot(
        `"{MyArray=[aws_subnet.public_a.id,aws_subnet.public_b.id,aws_subnet.public_c.id]}"`
      );
    });

    it('prints function attributes correctly', () => {
      expect(
        printTFLiteralExpression(
          makeTFMapExpression([
            makeTFAttribute(
              'MyFunction',
              makeTFFunctionExpression(
                'flatten',
                [
                  'aws_subnet.public_a.id',
                  'aws_subnet.public_b.id',
                  'aws_subnet.public_c.id'
                ],
                false
              )
            )
          ])
        )
      ).toMatchInlineSnapshot(
        `"{MyFunction=flatten(aws_subnet.public_a.id,aws_subnet.public_b.id,aws_subnet.public_c.id)}"`
      );
    });

    it('prints shallow maps correctly', () => {
      expect(
        printTFLiteralExpression(
          makeTFMapExpression([
            makeTFAttribute(
              'MyMap',
              makeTFMapExpression(
                ([
                  ['Name', makeTFSimpleLiteral('"MyName"')], //
                  ['TTL', makeTFSimpleLiteral('300')]
                ] as const).map(value => makeTFAttribute(value[0], value[1]))
              )
            )
          ])
        )
      ).toMatchInlineSnapshot(`"{MyMap={Name=\\"MyName\\"TTL=300}}"`);
    });

    it('prints nested maps correctly', () => {
      expect(
        printTFLiteralExpression(
          makeTFMapExpression([
            makeTFAttribute(
              'MyMap',
              makeTFMapExpression(
                ([
                  ['Name', makeTFSimpleLiteral('"MyName"')], //
                  ['TTL', makeTFSimpleLiteral('300')]
                ] as const).map(value => makeTFAttribute(value[0], value[1]))
              )
            )
          ])
        )
      ).toMatchInlineSnapshot(`"{MyMap={Name=\\"MyName\\"TTL=300}}"`);
    });

    it('prints a mixed map correctly', () => {
      expect(
        printTFLiteralExpression(
          makeTFMapExpression([
            makeTFAttribute(
              'MyMap',
              makeTFMapExpression(
                ([
                  ['Name', makeTFSimpleLiteral('"MyName"')], //
                  ['TTL', makeTFSimpleLiteral('300')],
                  [
                    'MyArray',
                    makeTFListExpression([
                      'aws_subnet.public_a.id',
                      'aws_subnet.public_b.id',
                      'aws_subnet.public_c.id'
                    ])
                  ]
                ] as const).map(value => makeTFAttribute(value[0], value[1]))
              )
            )
          ])
        )
      ).toMatchInlineSnapshot(
        `"{MyMap={Name=\\"MyName\\"TTL=300MyArray=[aws_subnet.public_a.id,aws_subnet.public_b.id,aws_subnet.public_c.id]}}"`
      );
    });
  });
});
