import {
  makeTFFunctionExpression,
  makeTFIdentifier,
  makeTFSimpleLiteral
} from '@src/makers';
import { TFFunctionExpression, TFNodeType } from '@src/types';

describe('makeTFFunctionExpression', () => {
  it('makes a TFFunctionExpression', () => {
    expect(
      makeTFFunctionExpression(
        makeTFIdentifier('identifier'),
        [makeTFSimpleLiteral('true')],
        true,
        { trailingOuterText: 'hello world' }
      )
    ).toStrictEqual<TFFunctionExpression>({
      type: TFNodeType.Function,
      name: makeTFIdentifier('identifier'),
      args: [makeTFSimpleLiteral('true')],
      hasTrailingComma: true,
      surroundingText: {
        leadingOuterText: '',
        leadingInnerText: '',
        trailingInnerText: '',
        trailingOuterText: 'hello world'
      }
    });
  });

  describe('when name is a string', () => {
    it('makes it into a TFIdentifier node', () => {
      expect(
        makeTFFunctionExpression(
          'identifier',
          [], //
          true,
          { leadingInnerText: 'hello world' }
        )
      ).toStrictEqual<TFFunctionExpression>({
        type: TFNodeType.Function,
        name: makeTFIdentifier('identifier'),
        args: [],
        hasTrailingComma: true,
        surroundingText: {
          leadingOuterText: '',
          leadingInnerText: 'hello world',
          trailingInnerText: '',
          trailingOuterText: ''
        }
      });
    });
  });
  describe('when args includes a string', () => {
    it('makes it into a TFSimpleLiteral node', () => {
      expect(
        makeTFFunctionExpression(
          makeTFIdentifier('trim'),
          ['hello world'],
          true,
          {
            leadingInnerText: 'hello world',
            trailingInnerText: 'hello sunshine'
          }
        )
      ).toStrictEqual<TFFunctionExpression>({
        type: TFNodeType.Function,
        name: makeTFIdentifier('trim'),
        args: [makeTFSimpleLiteral('hello world')],
        hasTrailingComma: true,
        surroundingText: {
          leadingOuterText: '',
          leadingInnerText: 'hello world',
          trailingInnerText: 'hello sunshine',
          trailingOuterText: ''
        }
      });
    });
  });
});
