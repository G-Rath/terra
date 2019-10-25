import { printLiteralExpression } from '@src/printers';
import { TFArgument } from '@src/types';

export const printArgument = (blockArgument: TFArgument): string =>
  [
    blockArgument.identifier,
    '=',
    printLiteralExpression(blockArgument.expression)
  ].join(' ');
