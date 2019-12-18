import { printTFArgument, printTFBlock } from '@src/printer';
import { TFBlockBodyBody, TFNodeType } from '@src/types';
import indentString from 'indent-string';

export const printBlockBody = (body: TFBlockBodyBody): string => {
  if (body.length === 0) {
    return '{}';
  }

  return [
    '{',
    ...body
      .map(node => {
        if (node.type === TFNodeType.Argument) {
          return printTFArgument(node);
        }

        if (node.type === TFNodeType.Block) {
          return printTFBlock(node);
        }

        throw new Error(`structural error: unknown node type "${node}"`);
      })
      .map(str => indentString(str, 2)),
    '}'
  ].join('\n');
};
