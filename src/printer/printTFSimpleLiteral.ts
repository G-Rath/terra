import { TFSimpleLiteral } from '@src/types';

export const printTFSimpleLiteral = (literal: TFSimpleLiteral): string =>
  [
    literal.surroundingText.leadingOuterText,
    literal.value,
    literal.surroundingText.trailingOuterText
  ].join('');
