import { printTFLabel } from '@src/printer';
import { printBlockBody } from '@src/printers';
import { TFBlock } from '@src/types';

export const printTFBlock = (block: TFBlock): string =>
  [
    block.surroundingText.leadingOuterText,
    block.blockType,
    ...block.labels.map(printTFLabel),
    printBlockBody(block.body.body),
    block.surroundingText.trailingOuterText
  ].join('');
