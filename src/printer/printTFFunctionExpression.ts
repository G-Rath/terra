import {
  printCommaSeparatedLiteralExpressionsWithinBrackets,
  printTFIdentifier
} from '@src/printer';
import { TFFunctionExpression } from '@src/types';

export const printTFFunctionExpression = (
  expression: TFFunctionExpression
): string =>
  [
    printTFIdentifier(expression.name),
    printCommaSeparatedLiteralExpressionsWithinBrackets(
      '(',
      expression.args,
      expression,
      ')'
    )
  ].join('');
