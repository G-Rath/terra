import { TFNodeType } from '@src/types';
import { makeTFDynamicBlock } from '@src/utils';

describe('makeTFDynamicBlock', () => {
  it('makes a TFDynamicBlock', () => {
    expect(makeTFDynamicBlock('name', [])).toStrictEqual({
      type: TFNodeType.Dynamic,
      name: 'name',
      content: true,
      forEach: [],
      labels: []
    });
  });
});
