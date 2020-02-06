import { printCommaSeparatedLiteralExpressionsWithinBrackets } from '@src/printer';
import { TFListExpression } from '@src/types';

export const printTFListExpression = (expression: TFListExpression): string =>
  printCommaSeparatedLiteralExpressionsWithinBrackets(
    '[',
    expression.values,
    expression,
    ']'
  );
