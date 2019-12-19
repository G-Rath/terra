import { makeTFBlockBody, makeTFLabel } from '@src/makers';
import {
  TFBlockBody,
  TFBlockBodyBody,
  TFLabel,
  TFModuleBlock,
  TFNodeType
} from '@src/types';

export const makeTFModuleBlock = <TIdentifier extends string = string>(
  name: TFLabel | string,
  body:
    | TFBlockBody<TIdentifier | 'source'>
    | TFBlockBodyBody<TIdentifier | 'source'>,
  surroundingText?: Partial<TFModuleBlock['surroundingText']>
): TFModuleBlock<TIdentifier | 'source'> => ({
  type: TFNodeType.Block,
  blockType: 'module',
  labels: [typeof name === 'string' ? makeTFLabel(name) : name],
  body: Array.isArray(body) ? makeTFBlockBody(body) : body,
  surroundingText: {
    leadingOuterText: '',
    trailingOuterText: '',
    ...surroundingText
  }
});
