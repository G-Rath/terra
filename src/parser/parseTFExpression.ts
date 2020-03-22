import { makeTFSimpleLiteral } from '@src/makers';
import {
  StringCursor,
  parseTFFunctionCall,
  parseTFHeredocLiteral,
  parseTFListExpression,
  parseTFMapExpression
} from '@src/parser';
import type { TFLiteralExpression } from '@src/types';

const isFunctionCall = (cursor: StringCursor): boolean => {
  const next = cursor.collectUntilWithComments(/[^/\s]/u);

  cursor.rewind(next.length);

  return next.endsWith('(');
};

export const parseTFExpression = (
  cursor: StringCursor
): TFLiteralExpression => {
  // the text leading up to the expression; the last char is the start of the expression
  const leadingOuterText = cursor
    .collectUntilWithComments(/[[<{"\w]/u)
    .slice(0, -1);

  cursor.rewind(1);

  if (cursor.char === '[') {
    cursor.rewind(leadingOuterText.length);

    return parseTFListExpression(cursor);
  }

  if (cursor.char === '<') {
    cursor.rewind(leadingOuterText.length);

    return parseTFHeredocLiteral(cursor);
  }

  if (cursor.char === '{') {
    cursor.rewind(leadingOuterText.length);

    return parseTFMapExpression(cursor);
  }

  if (cursor.char === '"') {
    return makeTFSimpleLiteral(
      cursor.collectUntil(/"[^"\\]*(?:\\.[^"\\]*)*"/u),
      { leadingOuterText }
    );
  }

  if (/\d/u.test(cursor.char)) {
    const expression = cursor.collectUntil(/[^\d.]/u).slice(0, -1);

    cursor.rewind(1);

    return makeTFSimpleLiteral(expression, { leadingOuterText });
  }

  const expression = cursor.collectUntil(/[^\w.-]/u).slice(0, -1);

  cursor.rewind(1);

  if (isFunctionCall(cursor)) {
    cursor.rewind(expression.length + leadingOuterText.length);

    return parseTFFunctionCall(cursor);
  }

  return makeTFSimpleLiteral(expression, { leadingOuterText });
};
