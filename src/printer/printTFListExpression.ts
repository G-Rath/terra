import { printLiteralExpression } from '@src/printers';
import { TFListExpression } from '@src/types';
import indentString from 'indent-string';

export const printTFListExpression = (expression: TFListExpression): string => {
  let content = indentString(
    expression.values
      .map(subexpression => `${printLiteralExpression(subexpression)}`)
      .join(',\n'),
    2
  );

  if (expression.hasTrailingComma) {
    content += ',';
  }

  // content += expression.innerTrailingText;

  return ['[', content, ']'].join('\n');
};
