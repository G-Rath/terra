import { StringCursor, parseTFExpression } from '@src/parser';
import type { TFLiteralExpression } from '@src/types';

const BRACKET_PAIRS = {
  '(': ')',
  '[': ']',
  '{': '}'
} as const;

interface ParsedCommaSeparatedLiteralExpressions {
  expressions: TFLiteralExpression[];
  hasTrailingComma: boolean;
  surroundingText: {
    leadingOuterText: string;
    trailingInnerText: string;
  };
}

export const parseCommaSeparatedLiteralExpressionsBrackets = (
  cursor: StringCursor,
  openingBracket: keyof typeof BRACKET_PAIRS
): ParsedCommaSeparatedLiteralExpressions => {
  const closingBracket = BRACKET_PAIRS[openingBracket];

  // the text leading up to the list; the last char is the start of the list
  const leadingOuterText = cursor
    .collectUntilWithComments(openingBracket)
    .slice(0, -1);

  const expressions: TFLiteralExpression[] = [];
  let trailingInnerText = '';
  let hasTrailingComma = false;

  do {
    trailingInnerText = cursor.collectUntilWithComments([
      // /\w/u,
      /[^\n /]/u,
      closingBracket
    ]);

    if (trailingInnerText.endsWith(closingBracket)) {
      trailingInnerText = trailingInnerText.slice(0, -1);

      break;
    }

    cursor.rewind(trailingInnerText.length);

    hasTrailingComma = false;

    const expression = parseTFExpression(cursor);
    const trailingOuterText = cursor.collectUntilWithComments([
      /[^\n /]/u,
      closingBracket
    ]);

    switch (trailingOuterText.slice(-1)) {
      case closingBracket:
        cursor.rewind(trailingOuterText.length);
        break;
      case ',':
        hasTrailingComma = true;
      // fallthrough
      default:
        expression.surroundingText.trailingOuterText = trailingOuterText.slice(
          0,
          -1
        );
    }

    expressions.push(expression);
  } while (cursor.char);

  return {
    expressions,
    hasTrailingComma,
    surroundingText: {
      leadingOuterText,
      trailingInnerText
    }
  };
};
