import { makeTFBlockLiteral } from '@src/makers';
import { TFNodeType } from '@src/types';

describe('makeTFBlockLiteral', () => {
  it('makes a TFBlockLiteral', () => {
    expect(makeTFBlockLiteral('name', [])).toStrictEqual({
      type: TFNodeType.Block,
      name: 'name',
      body: []
    });
  });
});
