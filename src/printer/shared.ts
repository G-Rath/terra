import { printTFLiteralExpression } from '@src/printer/printTFLiteralExpression';
import { SurroundingText, TFLiteralExpression } from '@src/types';

interface PrintCommaSeparatedLiteralExpressionsOptions {
  hasTrailingComma: boolean;
  surroundingText: SurroundingText;
}

export const printCommaSeparatedLiteralExpressionsWithinBrackets = (
  openingBracket: '(' | '[',
  expressions: TFLiteralExpression[],
  options: PrintCommaSeparatedLiteralExpressionsOptions,
  closingBracket: ')' | ']'
): string =>
  [
    options.surroundingText.leadingOuterText,
    openingBracket,
    options.surroundingText.leadingInnerText,
    ...expressions.map(printTFLiteralExpression).join(','),
    options.hasTrailingComma ? ',' : '',
    options.surroundingText.trailingInnerText,
    closingBracket,
    options.surroundingText.trailingOuterText
  ].join('');
