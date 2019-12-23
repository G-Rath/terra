import {
  makeTFArgument,
  makeTFIdentifier,
  makeTFListExpression,
  makeTFSimpleLiteral
} from '@src/makers';
import { TFArgument, TFNodeType } from '@src/types';

describe('makeTFArgument', () => {
  it('makes a TFArgument', () => {
    expect(
      makeTFArgument(
        makeTFIdentifier('identifier'),
        makeTFSimpleLiteral('true'),
        {
          leadingInnerText: 'hello world'
        }
      )
    ).toStrictEqual<TFArgument>({
      type: TFNodeType.Argument,
      identifier: makeTFIdentifier('identifier'),
      expression: makeTFSimpleLiteral('true'),
      surroundingText: {
        leadingInnerText: 'hello world',
        trailingInnerText: ''
      }
    });
  });

  describe('when identifier is a string', () => {
    it('makes it into a TFIdentifier node', () => {
      expect(
        makeTFArgument('identifier', '"hello world"', {
          leadingInnerText: 'hello world'
        })
      ).toStrictEqual<TFArgument>({
        type: TFNodeType.Argument,
        identifier: makeTFIdentifier('identifier'),
        expression: makeTFSimpleLiteral('"hello world"'),
        surroundingText: {
          leadingInnerText: 'hello world',
          trailingInnerText: ''
        }
      });
    });
  });
  describe('when expression is a string', () => {
    it('makes it into a TFSimpleLiteral node', () => {
      expect(
        makeTFArgument(makeTFIdentifier('identifier'), '"hello world"', {
          leadingInnerText: 'hello world'
        })
      ).toStrictEqual<TFArgument>({
        type: TFNodeType.Argument,
        identifier: makeTFIdentifier('identifier'),
        expression: makeTFSimpleLiteral('"hello world"'),
        surroundingText: {
          leadingInnerText: 'hello world',
          trailingInnerText: ''
        }
      });
    });
  });
  describe('when expression is an array', () => {
    it('makes it into a TFListExpression node', () => {
      expect(
        makeTFArgument(makeTFIdentifier('identifier'), ['"hello world"'], {
          leadingInnerText: 'hello world'
        })
      ).toStrictEqual<TFArgument>({
        type: TFNodeType.Argument,
        identifier: makeTFIdentifier('identifier'),
        expression: makeTFListExpression(['"hello world"']),
        surroundingText: {
          leadingInnerText: 'hello world',
          trailingInnerText: ''
        }
      });
    });
  });
});
