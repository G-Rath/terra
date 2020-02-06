import { makeTFFunctionExpression } from '@src/makers';
import {
  StringCursor,
  parseCommaSeparatedLiteralExpressionsBrackets,
  parseTFIdentifier
} from '@src/parser';
import { TFFunctionExpression } from '@src/types';

export const parseTFFunctionExpression = (
  cursor: StringCursor
): TFFunctionExpression => {
  const name = parseTFIdentifier(cursor);

  const {
    expressions,
    hasTrailingComma,
    surroundingText
  } = parseCommaSeparatedLiteralExpressionsBrackets(cursor, '(');

  return makeTFFunctionExpression(
    name,
    expressions,
    hasTrailingComma,
    surroundingText
  );
};
