import { printTFBlock } from '@src/printer';
import { TFFileAST } from '@src/types';

export const printFileAST = (fileAST: TFFileAST) =>
  fileAST.map(printTFBlock).join('\n\n');
