import { printTFSimpleLiteral, printTFListExpression } from '@src/printer';
import { TFLiteralExpression, TFNodeType } from '@src/types';
import indentString from 'indent-string';

export const printTFLiteralExpression = (
  literal: TFLiteralExpression
): string => {
  if (literal.type === TFNodeType.Simple) {
    return printTFSimpleLiteral(literal);
  }

  if (literal.type === TFNodeType.List) {
    return printTFListExpression(literal);
  }

  const type = literal.type;

  if (literal.type === TFNodeType.Map) {
    return [
      '{',
      ...literal.attributes
        .map(([identifier, expression]) =>
          [identifier, '=', printTFLiteralExpression(expression)].join(' ')
        )
        .map(str => indentString(str, 2)),
      '}'
    ].join('\n');
  }

  if (literal.type === TFNodeType.Function) {
    return [
      `${literal.name}(`,
      ...(['# FIXME - FUNCTIONS NOT YET SUPPORTED'] || literal.args).map(str =>
        indentString(str, 2)
      ),
      ')'
    ].join('\n');
  }

  throw new Error(`structural error - cannot print type "${type}"`);
};
