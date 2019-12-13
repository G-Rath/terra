import { makeTFBlockBody } from '@src/makers/makeTFBlockBody';
import {
  TFBlockBody,
  TFBlockBodyBody,
  TFDynamicBlock,
  TFNodeType
} from '@src/types';

export const makeTFDynamicBlock = <TIdentifier extends string = string>(
  name: string,
  content: TFBlockBody<TIdentifier> | TFBlockBodyBody<TIdentifier>
): TFDynamicBlock<TIdentifier> => ({
  type: TFNodeType.Dynamic,
  name,
  content: Array.isArray(content) ? makeTFBlockBody(content) : content,
  forEach: [],
  labels: []
});
