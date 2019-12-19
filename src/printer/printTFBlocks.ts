import { printTFBlock } from '@src/printer';
import { TFBlock } from '@src/types';

export const printTFBlocks = (blocks: TFBlock[]) =>
  blocks.map(printTFBlock).join('\n\n');
