import { printTFIdentifier, printTFLiteralExpression } from '@src/printer';
import { TFFunctionExpression } from '@src/types';

export const printTFFunctionExpression = (
  expression: TFFunctionExpression
): string =>
  [
    printTFIdentifier(expression.name),
    expression.surroundingText.leadingOuterText,
    '(',
    expression.surroundingText.leadingInnerText,
    ...expression.args.map(printTFLiteralExpression).join(','),
    expression.hasTrailingComma ? ',' : '',
    expression.surroundingText.trailingInnerText,
    ')',
    expression.surroundingText.trailingOuterText
  ].join('');
