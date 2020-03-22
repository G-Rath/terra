import { makeTFFunctionCall } from '@src/makers';
import {
  StringCursor,
  parseCommaSeparatedLiteralExpressionsBrackets,
  parseTFIdentifier
} from '@src/parser';
import type { TFFunctionCall } from '@src/types';

export const parseTFFunctionCall = (cursor: StringCursor): TFFunctionCall => {
  const name = parseTFIdentifier(cursor);

  const {
    expressions,
    hasTrailingComma,
    surroundingText
  } = parseCommaSeparatedLiteralExpressionsBrackets(cursor, '(');

  return makeTFFunctionCall(
    name,
    expressions,
    hasTrailingComma,
    surroundingText
  );
};
