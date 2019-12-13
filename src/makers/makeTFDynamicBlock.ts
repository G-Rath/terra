import { TFBlockBodyBody, TFDynamicBlock, TFNodeType } from '@src/types';

export const makeTFDynamicBlock = <TIdentifier extends string = string>(
  name: string,
  content: TFBlockBodyBody<TIdentifier>
): TFDynamicBlock<TIdentifier> => ({
  type: TFNodeType.Dynamic,
  name,
  content,
  forEach: [],
  labels: []
});
