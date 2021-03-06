import {
  makeTFAttribute,
  makeTFIdentifier,
  makeTFListExpression,
  makeTFSimpleLiteral
} from '@src/makers';
import * as makers from '@src/makers';
import { TFAttribute, TFAttributeKey, TFNodeType } from '@src/types';

describe('makeTFAttribute', () => {
  it('makes a TFAttribute', () => {
    expect(
      makeTFAttribute(makeTFIdentifier('key'), makeTFSimpleLiteral('true'), {
        leadingInnerText: 'hello world'
      })
    ).toStrictEqual<TFAttribute>({
      type: TFNodeType.Attribute,
      key: makeTFIdentifier('key'),
      value: makeTFSimpleLiteral('true'),
      surroundingText: {
        leadingInnerText: 'hello world',
        trailingInnerText: ''
      }
    });
  });

  describe('when key is a string', () => {
    it('uses makeTFAttributeKey', () => {
      const makeTFAttributeKeySpy = jest.spyOn(makers, 'makeTFAttributeKey');

      expect(
        makeTFAttribute('key', makeTFSimpleLiteral('"hello world"'))
      ).toStrictEqual<TFAttribute>({
        type: TFNodeType.Attribute,
        key: expect.objectContaining<Partial<TFAttributeKey>>({
          type: expect.stringMatching(
            /Label|Identifier/u
          ) as TFAttributeKey['type'],
          value: 'key',
          surroundingText: {
            leadingOuterText: '',
            trailingOuterText: ''
          }
        }) as TFAttributeKey,
        value: makeTFSimpleLiteral('"hello world"'),
        surroundingText: {
          leadingInnerText: '',
          trailingInnerText: ''
        }
      });

      expect(makeTFAttributeKeySpy).toHaveBeenCalledWith('key');
    });
  });

  describe('when value is a string', () => {
    it('makes it into a TFSimpleLiteral node', () => {
      expect(
        makeTFAttribute(
          makeTFIdentifier('key'),
          '"hello world"', //
          { trailingInnerText: 'hello world' }
        )
      ).toStrictEqual<TFAttribute>({
        type: TFNodeType.Attribute,
        key: makeTFIdentifier('key'),
        value: makeTFSimpleLiteral('"hello world"'),
        surroundingText: {
          leadingInnerText: '',
          trailingInnerText: 'hello world'
        }
      });
    });
  });

  describe('when value is an array', () => {
    it('makes it into a TFListExpression node', () => {
      expect(
        makeTFAttribute(
          makeTFIdentifier('key'),
          ['"hello world"'], //
          { trailingInnerText: 'hello world' }
        )
      ).toStrictEqual<TFAttribute>({
        type: TFNodeType.Attribute,
        key: makeTFIdentifier('key'),
        value: makeTFListExpression(['"hello world"']),
        surroundingText: {
          leadingInnerText: '',
          trailingInnerText: 'hello world'
        }
      });
    });
  });
});
