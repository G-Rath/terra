import { makeTFBlockBody } from '@src/makers/makeTFBlockBody';
import { makeTFLabel } from '@src/makers/makeTFLabel';
import {
  TFBlock,
  TFBlockBody,
  TFBlockBodyBody,
  TFLabel,
  TFNodeType,
  TFResourceBlock
} from '@src/types';

export const makeTFBlock = <TIdentifier extends string = string>(
  blockType: string,
  labels: Array<TFLabel | string>,
  body: TFBlockBody<TIdentifier> | TFBlockBodyBody<TIdentifier>,
  surroundingText?: Partial<TFResourceBlock['surroundingText']>
): TFBlock<TIdentifier> => ({
  type: TFNodeType.Block,
  blockType,
  labels: labels.map(label =>
    typeof label === 'string' ? makeTFLabel(label) : label
  ),
  body: Array.isArray(body) ? makeTFBlockBody(body) : body,
  surroundingText: {
    leadingOuterText: '',
    trailingOuterText: '',
    ...surroundingText
  }
});
