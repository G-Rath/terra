import { printCommaSeparatedLiteralExpressionsWithinBrackets } from '@src/printer';
import type { TFListExpression } from '@src/types';

export const printTFListExpression = (expression: TFListExpression): string =>
  printCommaSeparatedLiteralExpressionsWithinBrackets(
    '[',
    expression.values,
    expression,
    ']'
  );
