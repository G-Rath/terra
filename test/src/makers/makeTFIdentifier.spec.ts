import { makeTFIdentifier } from '@src/makers';
import { TFIdentifier, TFNodeType } from '@src/types';

describe('makeTFIdentifier', () => {
  it('makes a TFIdentifier', () => {
    expect(
      makeTFIdentifier('name', {
        leadingOuterText: '/* hello world */'
      })
    ).toStrictEqual<TFIdentifier>({
      type: TFNodeType.Identifier,
      value: 'name',
      surroundingText: {
        leadingOuterText: '/* hello world */',
        trailingOuterText: ''
      }
    });
  });
});
