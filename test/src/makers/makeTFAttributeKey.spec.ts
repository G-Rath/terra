import { makeTFAttributeKey } from '@src/makers';
import { TFAttributeKey, TFIdentifier, TFLabel, TFNodeType } from '@src/types';

describe('makeTFAttributeKey', () => {
  describe('when the key is in quotes', () => {
    it('makes a TFLabel node', () => {
      expect(
        makeTFAttributeKey('"key"', { leadingOuterText: 'hello world' })
      ).toStrictEqual<TFAttributeKey & TFLabel>({
        type: TFNodeType.Label,
        value: '"key"',
        surroundingText: {
          leadingOuterText: 'hello world',
          trailingOuterText: ''
        }
      });
    });
  });

  describe('when the key is not in quotes', () => {
    it('makes a TFIdentifier node', () => {
      expect(
        makeTFAttributeKey('key', { trailingOuterText: 'hello world' })
      ).toStrictEqual<TFAttributeKey & TFIdentifier>({
        type: TFNodeType.Identifier,
        value: 'key',
        surroundingText: {
          leadingOuterText: '',
          trailingOuterText: 'hello world'
        }
      });
    });
  });
});
