import { printTFBlock } from '@src/printer';
import { TFFileAST, TFNodeType } from '@src/types';

export const printFileAST = (fileAST: TFFileAST) =>
  fileAST
    .map(block => {
      switch (block.type) {
        case TFNodeType.Block:
          return printTFBlock(block);
        default:
          throw new Error(`"${block.type}" is not yet supported`);
      }
    })
    .join('\n\n');
