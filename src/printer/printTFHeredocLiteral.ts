import type { TFHeredocLiteral } from '@src/types';

export const printTFHeredocLiteral = (literal: TFHeredocLiteral): string =>
  [
    literal.surroundingText.leadingOuterText,
    `<<${literal.indented ? '-' : ''}${literal.delimiter}`,
    literal.surroundingText.leadingInnerText,
    literal.content,
    literal.surroundingText.trailingInnerText,
    literal.delimiter,
    literal.surroundingText.trailingOuterText
  ].join('');
