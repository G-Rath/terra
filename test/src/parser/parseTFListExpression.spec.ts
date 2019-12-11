import { makeTFListExpression } from '@src/makers';
import * as parser from '@src/parser';
import { parseTFListExpression, StringCursor } from '@src/parser';
import { TFListExpression } from '@src/types';

describe('parseTFListExpression', () => {
  describe('leading text', () => {
    it('collects up to the opening square bracket', () => {
      const { leadingOuterText } = parseTFListExpression(
        new StringCursor(' [ "hello world" ] ')
      ).surroundingText;

      expect(leadingOuterText).toBe(' ');
    });

    it('preserves comments', () => {
      const { leadingOuterText } = parseTFListExpression(
        new StringCursor(' /* [ hello world ] */ [ "hello world" ] ')
      ).surroundingText;

      expect(leadingOuterText).toBe(' /* [ hello world ] */ ');
    });
  });

  describe('values text', () => {
    it('parses a single value single line list correctly', () => {
      expect(
        parseTFListExpression(new StringCursor('["hello world"] '))
      ).toStrictEqual<TFListExpression>({
        ...makeTFListExpression(['"hello world"']),
        surroundingText: expect.any(Object)
      });
    });

    it('parses a multi-value single line list correctly', () => {
      expect(
        parseTFListExpression(new StringCursor('["hello", "world"] '))
      ).toStrictEqual<TFListExpression>({
        ...makeTFListExpression(['"hello"', '"world"']),
        surroundingText: expect.any(Object)
      });
    });

    it('parses a single value multi-line list correctly', () => {
      expect(
        parseTFListExpression(
          new StringCursor(['[', '"hello world"', ']'].join('\n'))
        )
      ).toStrictEqual<TFListExpression>({
        ...makeTFListExpression(['"hello world"']),
        surroundingText: expect.any(Object)
      });
    });

    it('parses a multi-value multi-line list', () => {
      expect(
        parseTFListExpression(
          new StringCursor(['[', '"hello",', '"world"', '] '].join('\n'))
        )
      ).toStrictEqual<TFListExpression>({
        ...makeTFListExpression(['"hello"', '"world"']),
        surroundingText: expect.any(Object)
      });
    });

    it('uses parseTFExpression', () => {
      const parseTFExpressionSpy = jest.spyOn(parser, 'parseTFExpression');

      parseTFListExpression(new StringCursor('["hello world"] '));

      expect(parseTFExpressionSpy).toHaveBeenCalledWith(
        expect.any(StringCursor)
      );
    });

    it('notes trailing commas', () => {
      expect(
        parseTFListExpression(
          new StringCursor(['[', '"hello",', '"world",', '] '].join('\n'))
        )
      ).toStrictEqual<TFListExpression>({
        ...makeTFListExpression(['"hello"', '"world"'], true),
        surroundingText: expect.any(Object)
      });
    });
  });

  describe('inner trailing text', () => {
    it('collects up to the closing square bracket', () => {
      const { trailingInnerText } = parseTFListExpression(
        new StringCursor('[ "hello world" ] ')
      ).surroundingText;

      expect(trailingInnerText).toBe(' ');
    });

    it('collects over multiple lines', () => {
      const { trailingInnerText } = parseTFListExpression(
        new StringCursor(
          [
            '[',
            '"hello world"',
            '/* hello world */',
            '// hello sunshine',
            ']'
          ].join('\n')
        )
      ).surroundingText;

      expect(trailingInnerText).toBe(
        ['', '/* hello world */', '// hello sunshine', ''].join('\n')
      );
    });

    it('includes comments', () => {
      const { trailingInnerText } = parseTFListExpression(
        new StringCursor('[ "hello world" /* hello world */ ] ')
      ).surroundingText;

      expect(trailingInnerText).toBe(' /* hello world */ ');
    });
  });
});
