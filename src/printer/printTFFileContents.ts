import { printTFBlocks } from '@src/printer';
import { TFFileContents } from '@src/types';

export const printTFFileContents = (contents: TFFileContents): string =>
  [
    contents.surroundingText.leadingOuterText,
    printTFBlocks(contents.blocks),
    contents.surroundingText.trailingOuterText
  ].join('');
