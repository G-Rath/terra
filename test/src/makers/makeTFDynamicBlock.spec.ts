import { makeTFDynamicBlock } from '@src/makers';
import { TFNodeType } from '@src/types';

describe('makeTFDynamicBlock', () => {
  it('makes a TFDynamicBlock', () => {
    expect(makeTFDynamicBlock('name', [])).toStrictEqual({
      type: TFNodeType.Dynamic,
      name: 'name',
      content: [],
      forEach: [],
      labels: []
    });
  });
});
