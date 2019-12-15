import { makeTFSimpleLiteral } from '@src/makers';
import * as parser from '@src/parser';
import { parseTFExpression, StringCursor } from '@src/parser';
import { TFSimpleLiteral } from '@src/types';

describe('parseTFExpression', () => {
  describe('leading text', () => {
    it('collects basic leading text correctly', () => {
      expect(parseTFExpression(new StringCursor(' hello '))).toStrictEqual<
        TFSimpleLiteral
      >(makeTFSimpleLiteral('hello', { leadingOuterText: ' ' }));
    });

    it('does not treat comments in leading text as the start of the label', () => {
      expect(
        parseTFExpression(new StringCursor('/* hello */world '))
      ).toStrictEqual<TFSimpleLiteral>(
        makeTFSimpleLiteral('world', { leadingOuterText: '/* hello */' })
      );
    });
  });

  describe('expression text', () => {
    describe('when the expression is a list', () => {
      it('uses parseTFListExpression', () => {
        const parseTFListExpressionSpy = jest.spyOn(
          parser,
          'parseTFListExpression'
        );

        parseTFExpression(new StringCursor('["hello world"] '));

        expect(parseTFListExpressionSpy).toHaveBeenCalledWith(
          expect.any(StringCursor)
        );
      });
    });

    describe('when the expression is a map', () => {
      it('identifies the start of maps', () => {
        expect(() =>
          parseTFExpression(new StringCursor('{ Name = "My App" } '))
        ).toThrow('maps are not yet supported');
      });

      it.todo('parses empty maps');

      it.todo('parses single element maps');

      it.todo('parses multi-line maps');

      it.todo('parses single-line maps');
    });

    describe('when the expression is a string literal', () => {
      it('parses empty string literals', () => {
        expect(parseTFExpression(new StringCursor('""'))).toStrictEqual<
          TFSimpleLiteral
        >(makeTFSimpleLiteral('""'));
      });

      it('parses basic string literals', () => {
        expect(
          parseTFExpression(new StringCursor('"hello world"'))
        ).toStrictEqual<TFSimpleLiteral>(makeTFSimpleLiteral('"hello world"'));
      });

      it('parses escaped string literals', () => {
        expect(
          parseTFExpression(new StringCursor('"hello \\"world\\""'))
        ).toStrictEqual<TFSimpleLiteral>(
          makeTFSimpleLiteral('"hello \\"world\\""')
        );
      });

      it('parses single escaped string literals', () => {
        expect(parseTFExpression(new StringCursor('"\\""'))).toStrictEqual<
          TFSimpleLiteral
        >(makeTFSimpleLiteral('"\\""'));
      });

      it('parses deeply escaped string literals', () => {
        expect(
          parseTFExpression(new StringCursor('"hello \\\\\\"world\\\\\\""'))
        ).toStrictEqual<TFSimpleLiteral>(
          makeTFSimpleLiteral('"hello \\\\\\"world\\\\\\""')
        );
      });
    });

    describe('when the expression is a numerical literal', () => {
      it('parses single digit literals', () => {
        expect(parseTFExpression(new StringCursor('1 '))).toStrictEqual<
          TFSimpleLiteral
        >(makeTFSimpleLiteral('1'));
      });

      it('parses multi digit literals', () => {
        expect(parseTFExpression(new StringCursor('123456789 '))).toStrictEqual<
          TFSimpleLiteral
        >(makeTFSimpleLiteral('123456789'));
      });

      it('parses floating numerical literals', () => {
        expect(
          parseTFExpression(new StringCursor('1.23456789 '))
        ).toStrictEqual<TFSimpleLiteral>(makeTFSimpleLiteral('1.23456789'));
      });
    });

    describe('when the expression is unquoted', () => {
      it('parses unquoted expressions', () => {
        expect(
          parseTFExpression(new StringCursor('aws_route53_zone.my_zone.id '))
        ).toStrictEqual<TFSimpleLiteral>(
          makeTFSimpleLiteral('aws_route53_zone.my_zone.id')
        );
      });
    });

    describe('when the expression is a function', () => {
      it('identifies the start of functions', () => {
        expect(() =>
          parseTFExpression(new StringCursor('length(aws_eip.external_ips) '))
        ).toThrow('functions are not yet supported');
      });
    });
  });
});
