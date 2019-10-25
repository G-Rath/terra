import { printArgument, printBlockLiteral } from '@src/printers';
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

        if (node.type === TFNodeType.Block) {
          return printBlockLiteral(node);
        }

        if (node.type === TFNodeType.Dynamic) {
          return `# FIXME: ${node.type} is not yet supported`;
        }

        throw new Error(`structural error: unknown node type "${node}"`);
      })
      .map(str => indentString(str, 2)),
    '}'
  ].join('\n');
};
