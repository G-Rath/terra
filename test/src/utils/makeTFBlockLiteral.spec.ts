import { TFNodeType } from '@src/types';
import { makeTFBlockLiteral } from '@src/utils';

describe('makeTFBlockLiteral', () => {
  it('makes a TFBlockLiteral', () => {
    expect(makeTFBlockLiteral('name', [])).toStrictEqual({
      type: TFNodeType.Block,
      name: 'name',
      body: []
    });
  });
});
