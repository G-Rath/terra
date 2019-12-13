import { makeTFBlockBody, makeTFBlockLiteral } from '@src/makers';
import { TFBlockLiteral, TFNodeType } from '@src/types';

describe('makeTFBlockLiteral', () => {
  it('makes a TFBlockLiteral', () => {
    expect(makeTFBlockLiteral('name', makeTFBlockBody([]))).toStrictEqual<
      TFBlockLiteral
    >({
      type: TFNodeType.Block,
      name: 'name',
      body: makeTFBlockBody([])
    });
  });

  describe('when "body" is an array', () => {
    it('makes it into a TFBlockBody node', () => {
      expect(makeTFBlockLiteral('name', [])).toStrictEqual<TFBlockLiteral>({
        type: TFNodeType.Block,
        name: 'name',
        body: makeTFBlockBody([])
      });
    });
  });
});
