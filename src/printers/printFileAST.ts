import { printResourceBlock } from '@src/printers';
import { TFFileAST, TFNodeType } from '@src/types';

export const printFileAST = (fileAST: TFFileAST) =>
  fileAST
    .map(block => {
      switch (block.type) {
        case TFNodeType.Resource:
          return printResourceBlock(block);
        default:
          throw new Error(`"${block.type}" is not yet supported`);
      }
    })
    .join('\n\n');
