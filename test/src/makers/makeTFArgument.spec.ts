import { makeTFArgument, makeTFSimpleLiteral } from '@src/makers';
import { TFArgument, TFNodeType } from '@src/types';

describe('makeTFArgument', () => {
  it('makes a TFArgument', () => {
    expect(
      makeTFArgument('identifier', makeTFSimpleLiteral('true'), {
        leadingInnerText: 'hello world'
      })
    ).toStrictEqual<TFArgument>({
      type: TFNodeType.Argument,
      identifier: 'identifier',
      expression: makeTFSimpleLiteral('true'),
      surroundingText: {
        leadingInnerText: 'hello world',
        trailingInnerText: ''
      }
    });
  });

  describe('when expression is a string', () => {
    it('makes it into a TFSimpleLiteral node', () => {
      expect(
        makeTFArgument('identifier', '"hello world"', {
          leadingInnerText: 'hello world'
        })
      ).toStrictEqual<TFArgument>({
        type: TFNodeType.Argument,
        identifier: 'identifier',
        expression: makeTFSimpleLiteral('"hello world"'),
        surroundingText: {
          leadingInnerText: 'hello world',
          trailingInnerText: ''
        }
      });
    });
  });
});
