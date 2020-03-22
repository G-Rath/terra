import { makeTFListExpression } from '@src/makers';
import {
  StringCursor,
  parseCommaSeparatedLiteralExpressionsBrackets
} from '@src/parser';
import type { TFListExpression } from '@src/types';

export const parseTFListExpression = (
  cursor: StringCursor
): TFListExpression => {
  const {
    expressions,
    hasTrailingComma,
    surroundingText
  } = parseCommaSeparatedLiteralExpressionsBrackets(cursor, '[');

  return makeTFListExpression(expressions, hasTrailingComma, surroundingText);
};
