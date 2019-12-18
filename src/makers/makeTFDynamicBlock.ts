import { makeTFBlockBody, makeTFLabel } from '@src/makers';
import {
  TFBlockBody,
  TFBlockBodyBody,
  TFDynamicBlock,
  TFLabel,
  TFNodeType
} from '@src/types';

export const makeTFDynamicBlock = <TIdentifier extends string = string>(
  name: TFLabel | string,
  body:
    | TFBlockBody<TIdentifier | 'content' | 'for_each' | 'iterator'>
    | TFBlockBodyBody<TIdentifier | 'content' | 'for_each' | 'iterator'>,
  surroundingText?: Partial<TFDynamicBlock['surroundingText']>
): TFDynamicBlock<TIdentifier | 'content' | 'for_each' | 'iterator'> => ({
  type: TFNodeType.Block,
  blockType: 'dynamic',
  labels: [typeof name === 'string' ? makeTFLabel(name) : name],
  body: Array.isArray(body) ? makeTFBlockBody(body) : body,
  surroundingText: {
    leadingOuterText: '',
    trailingOuterText: '',
    ...surroundingText
  }
});
