import { TFBlockBody, TFDynamicBlock, TFNodeType } from '@src/types';

export const makeTFDynamicBlock = <TIdentifier extends string = string>(
  name: string,
  content: TFBlockBody<TIdentifier>
): TFDynamicBlock<TIdentifier> => ({
  type: TFNodeType.Dynamic,
  name,
  content,
  forEach: [],
  labels: []
});
