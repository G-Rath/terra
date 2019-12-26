import { makeTFSimpleLiteral } from '@src/makers';
import {
  parseTFFunctionExpression,
  parseTFListExpression,
  parseTFMapExpression,
  StringCursor
} from '@src/parser';
import { TFLiteralExpression } from '@src/types';

export const parseTFExpression = (
  cursor: StringCursor
): TFLiteralExpression => {
  // the text leading up to the expression; the last char is the start of the expression
  const leadingOuterText = cursor
    .collectUntilWithComments(/[[{\d"\w]/)
    .slice(0, -1);

  cursor.rewind(1);

  if (cursor.char === '[') {
    cursor.rewind(leadingOuterText.length);

    return parseTFListExpression(cursor);
  }

  if (cursor.char === '{') {
    cursor.rewind(leadingOuterText.length);

    return parseTFMapExpression(cursor);
  }

  if (cursor.char === '"') {
    return makeTFSimpleLiteral(
      cursor.collectUntil(/"[^"\\]*(?:\\.[^"\\]*)*"/),
      { leadingOuterText }
    );
  }

  if (/\d/.test(cursor.char)) {
    const expression = cursor.collectUntil(/[^\d.]/).slice(0, -1);

    cursor.rewind(1);

    return makeTFSimpleLiteral(expression, { leadingOuterText });
  }

  const expression = cursor.collectUntil([' ', '\n', '(', ')', ']', ',']);

  if (expression.endsWith('(')) {
    cursor.rewind(expression.length + leadingOuterText.length);

    return parseTFFunctionExpression(cursor);
  }

  cursor.rewind(1);

  return makeTFSimpleLiteral(expression.slice(0, -1), { leadingOuterText });
};
