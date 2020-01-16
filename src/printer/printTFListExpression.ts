import { printTFLiteralExpression } from '@src/printer';
import { TFListExpression } from '@src/types';

export const printTFListExpression = (expression: TFListExpression): string =>
  [
    expression.surroundingText.leadingOuterText,
    '[',
    expression.surroundingText.leadingInnerText,
    ...expression.values.map(printTFLiteralExpression).join(','),
    expression.hasTrailingComma ? ',' : '',
    expression.surroundingText.trailingInnerText,
    ']',
    expression.surroundingText.trailingOuterText
  ].join('');
