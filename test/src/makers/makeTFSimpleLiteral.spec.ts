import { makeTFSimpleLiteral } from '@src/makers';
import { TFNodeType, TFSimpleLiteral } from '@src/types';

describe('makeTFSimpleLiteral', () => {
  it('makes a makeTFSimpleLiteral', () => {
    expect(
      makeTFSimpleLiteral('1', {
        leadingOuterText: 'hello world'
      })
    ).toStrictEqual<TFSimpleLiteral>({
      type: TFNodeType.Simple,
      value: '1',
      surroundingText: {
        leadingOuterText: 'hello world',
        trailingOuterText: ''
      }
    });
  });
});
