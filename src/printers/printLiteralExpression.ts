import { printPrimitiveLiteral } from '@src/printers';
import { TFLiteralExpression, TFNodeType } from '@src/types';
import indentString from 'indent-string';

export const printLiteralExpression = (
  literal: TFLiteralExpression
): string => {
  if (literal === null || typeof literal !== 'object') {
    return printPrimitiveLiteral(literal);
  }

  if (Array.isArray(literal)) {
    return [
      '[',
      indentString(
        literal
          .map(subexpression => `${printLiteralExpression(subexpression)}`)
          .join(',\n'),
        2
      ),
      ']'
    ].join('\n');
  }

  if (literal.type === TFNodeType.Map) {
    return [
      '{',
      ...literal.attributes
        .map(([identifier, expression]) =>
          [identifier, '=', printLiteralExpression(expression)].join(' ')
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

  throw new Error('structural error');
};
