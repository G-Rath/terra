import {
  makeTFFunctionExpression,
  makeTFIdentifier,
  makeTFSimpleLiteral
} from '@src/makers';
import * as parser from '@src/parser';
import { parseTFFunctionExpression, StringCursor } from '@src/parser';
import { TFFunctionExpression } from '@src/types';

describe('parseTFFunctionExpression', () => {
  describe('function name', () => {
    it('uses parseTFIdentifier', () => {
      const parseTFIdentifierSpy = jest.spyOn(parser, 'parseTFIdentifier');

      parseTFFunctionExpression(new StringCursor('trim()'));

      expect(parseTFIdentifierSpy).toHaveBeenCalledWith(
        expect.any(StringCursor)
      );
    });
  });

  describe('leading text', () => {
    it('collects from the name to the opening parenthesis', () => {
      const { leadingOuterText } = parseTFFunctionExpression(
        new StringCursor('trim ()')
      ).surroundingText;

      expect(leadingOuterText).toBe(' ');
    });

    it('preserves comments', () => {
      const { leadingOuterText } = parseTFFunctionExpression(
        new StringCursor('trim/* hello world */()')
      ).surroundingText;

      expect(leadingOuterText).toBe('/* hello world */');
    });
  });

  describe('function arguments', () => {
    it('uses parseTFExpression', () => {
      const parseTFExpressionSpy = jest.spyOn(parser, 'parseTFExpression');

      parseTFFunctionExpression(new StringCursor('trim(1, 2, 3)'));

      expect(parseTFExpressionSpy).toHaveBeenCalledTimes(3);
      expect(parseTFExpressionSpy).toHaveBeenCalledWith(
        expect.any(StringCursor)
      );
    });

    it('notes trailing commas', () => {
      expect(
        parseTFFunctionExpression(
          new StringCursor(['trim(', '"hello",', '"world",', ')'].join('\n'))
        )
      ).toStrictEqual<TFFunctionExpression>({
        ...makeTFFunctionExpression(
          makeTFIdentifier('trim'),
          ['"hello"', '"world"'].map(v =>
            makeTFSimpleLiteral(v, {
              leadingOuterText: expect.any(String),
              trailingOuterText: expect.any(String)
            })
          ),
          true
        ),
        surroundingText: expect.any(Object)
      });
    });
  });

  describe('inner trailing text', () => {
    it('collects up to the closing parenthesis', () => {
      const { trailingInnerText } = parseTFFunctionExpression(
        new StringCursor('trim( "hello world" )')
      ).surroundingText;

      expect(trailingInnerText).toBe(' ');
    });

    it('collects over multiple lines', () => {
      const { trailingInnerText } = parseTFFunctionExpression(
        new StringCursor(
          [
            'trim(',
            '"hello world"',
            '/* hello world */',
            '// hello sunshine',
            ')'
          ].join('\n')
        )
      ).surroundingText;

      expect(trailingInnerText).toBe(
        ['', '/* hello world */', '// hello sunshine', ''].join('\n')
      );
    });

    it('includes comments', () => {
      const { trailingInnerText } = parseTFFunctionExpression(
        new StringCursor('trim("hello"/* world */)')
      ).surroundingText;

      expect(trailingInnerText).toBe('/* world */');
    });
  });
});
