import { printTFBlock } from '@src/printer';
import { TFBlock } from '@src/types';

export const printTFBlocks = (blocks: TFBlock[]): string =>
  blocks.map(printTFBlock).join('');
