import { makeTFBlockBody, makeTFDynamicBlock } from '@src/makers';
import { TFDynamicBlock, TFNodeType } from '@src/types';

describe('makeTFDynamicBlock', () => {
  it('makes a TFDynamicBlock', () => {
    expect(makeTFDynamicBlock('name', makeTFBlockBody([]))).toStrictEqual<
      TFDynamicBlock
    >({
      type: TFNodeType.Dynamic,
      name: 'name',
      content: makeTFBlockBody([]),
      forEach: [],
      labels: []
    });
  });

  describe('when "body" is an array', () => {
    it('makes it into a TFBlockBody node', () => {
      expect(makeTFDynamicBlock('name', [])).toStrictEqual<TFDynamicBlock>({
        type: TFNodeType.Dynamic,
        name: 'name',
        content: makeTFBlockBody([]),
        forEach: [],
        labels: []
      });
    });
  });
});
