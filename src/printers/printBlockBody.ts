import { printArgument } from '@src/printers';
import { TFBlockBody, TFNodeType } from '@src/types';
import indentString from 'indent-string';

export const printBlockBody = (body: TFBlockBody): string => {
  if (body.length === 0) {
    return '{}';
  }

  return [
    '{',
    ...body
      .map(node => {
        if (node.type === TFNodeType.Argument) {
          return printArgument(node);
        }

        throw new Error(`structural error: unknown node type "${node}"`);
      })
      .map(str => indentString(str, 2)),
    '}'
  ].join('\n');
};
