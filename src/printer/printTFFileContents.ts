import { printTFBlocks } from '@src/printer';
import type { TFFileContents } from '@src/types';

export const printTFFileContents = (contents: TFFileContents): string =>
  [
    contents.surroundingText.leadingOuterText,
    printTFBlocks(contents.blocks),
    contents.surroundingText.trailingOuterText
  ].join('');
