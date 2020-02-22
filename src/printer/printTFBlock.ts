import { printTFBlockBody, printTFLabel } from '@src/printer';
import { TFBlock } from '@src/types';

export const printTFBlock = (block: TFBlock): string =>
  [
    block.surroundingText.leadingOuterText,
    block.blockType,
    ...block.labels.map(printTFLabel),
    printTFBlockBody(block.body),
    block.surroundingText.trailingOuterText
  ].join('');
