import { makeTFSimpleLiteral } from '@src/makers';
import * as parser from '@src/parser';
import { StringCursor, parseTFExpression } from '@src/parser';
import { TFHeredocLiteral, TFNodeType, TFSimpleLiteral } from '@src/types';
import dedent from 'dedent';

describe('parseTFExpression', () => {
  describe('leading text', () => {
    it('collects basic leading text correctly', () => {
      expect(parseTFExpression(new StringCursor(' hello /**/'))).toStrictEqual<
        TFSimpleLiteral
      >(makeTFSimpleLiteral('hello', { leadingOuterText: ' ' }));
    });

    it('does not treat comments in leading text as the start of the label', () => {
      expect(
        parseTFExpression(new StringCursor('/* hello */world /**/'))
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
      it('uses parseTFMapExpression', () => {
        const parseTFMapExpressionSpy = jest.spyOn(
          parser,
          'parseTFMapExpression'
        );

        parseTFExpression(new StringCursor('{ "key" = "value" } '));

        expect(parseTFMapExpressionSpy).toHaveBeenCalledWith(
          expect.any(StringCursor)
        );
      });
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

    describe('when the expression is a heredoc literal', () => {
      it('parses the expression', () => {
        expect(
          parseTFExpression(
            new StringCursor(dedent`
              <<EOF
                hello
                  world
                    EOF /* not valid, but we parse it anyway */
              \n
            `)
          )
        ).toStrictEqual<TFHeredocLiteral>({
          type: TFNodeType.Heredoc,
          delimiter: 'EOF',
          content: '  hello\n    world',
          indented: false,
          surroundingText: {
            leadingOuterText: '',
            leadingInnerText: '\n',
            trailingInnerText: '\n      ',
            trailingOuterText: ' /* not valid, but we parse it anyway */\n'
          }
        });
      });
    });

    describe('when the expression is unquoted', () => {
      it('parses unquoted expressions', () => {
        expect(
          parseTFExpression(
            new StringCursor('aws_route53_zone.my_zone.id /**/')
          )
        ).toStrictEqual<TFSimpleLiteral>(
          makeTFSimpleLiteral('aws_route53_zone.my_zone.id')
        );
      });
    });

    describe('when the expression is a function', () => {
      it('uses parseTFFunctionCall', () => {
        const parseTFFunctionCallSpy = jest.spyOn(
          parser,
          'parseTFFunctionCall'
        );

        parseTFExpression(new StringCursor('trim("hello world")'));

        expect(parseTFFunctionCallSpy).toHaveBeenCalledWith(
          expect.any(StringCursor)
        );
      });

      describe('when there is text between the function name and call', () => {
        it('uses parseTFFunctionCall', () => {
          const parseTFFunctionCallSpy = jest.spyOn(
            parser,
            'parseTFFunctionCall'
          );

          parseTFExpression(new StringCursor('trim /* hello */("world")'));

          expect(parseTFFunctionCallSpy).toHaveBeenCalledWith(
            expect.any(StringCursor)
          );
        });
      });
    });
  });
});
