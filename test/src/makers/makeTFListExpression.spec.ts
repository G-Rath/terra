import { makeTFListExpression, makeTFSimpleLiteral } from '@src/makers';
import { TFListExpression, TFNodeType } from '@src/types';

describe('makeTFListExpression', () => {
  it('makes a TFListExpression', () => {
    expect(
      makeTFListExpression([], true, {
        leadingInnerText: 'hello world',
        trailingInnerText: 'hello sunshine'
      })
    ).toStrictEqual<TFListExpression>({
      type: TFNodeType.List,
      hasTrailingComma: true,
      values: [],
      surroundingText: {
        leadingInnerText: 'hello world',
        leadingOuterText: '',
        trailingInnerText: 'hello sunshine',
        trailingOuterText: ''
      }
    });
  });

  describe('when values includes a string', () => {
    it('makes it into a TFSimpleLiteral node', () => {
      expect(
        makeTFListExpression(['hello world'], true, {
          leadingInnerText: 'hello world',
          trailingInnerText: 'hello sunshine'
        })
      ).toStrictEqual<TFListExpression>({
        type: TFNodeType.List,
        hasTrailingComma: true,
        values: [makeTFSimpleLiteral('hello world')],
        surroundingText: {
          leadingInnerText: 'hello world',
          leadingOuterText: '',
          trailingInnerText: 'hello sunshine',
          trailingOuterText: ''
        }
      });
    });
  });
});
