import { StringCursor } from '@src/parser';
import { TFLiteralExpression } from '@src/types';

export const parseTFExpression = (
  cursor: StringCursor
): TFLiteralExpression => {
  // the text leading up to the expression; the last char is the start of the expression
  cursor.collectUntilWithComments(/[[{\d"\w]/).slice(0, -1);

  cursor.rewind(1);

  if (cursor.char === '[') {
    // array of elements
    throw new Error('arrays are not yet supported');
    // do {
    //
    // } while(cursor.char !== ']');
  }

  if (cursor.char === '{') {
    // map of elements
    throw new Error('maps are not yet supported');
    // parseTFBlockBody();
    // parseTFMapExpression();
  }

  if (cursor.char === '"') {
    return cursor.collectUntil(/"[^"\\]*(?:\\.[^"\\]*)*"/);
  }

  if (/\d/.test(cursor.char)) {
    const expression = cursor.collectUntil(/[^\d.]/).slice(0, -1);

    cursor.rewind(1);

    return expression;
  }

  const expression = cursor.collectUntil([' ', '\n', '(']);

  if (expression.endsWith('(')) {
    // function expression

    throw new Error('functions are not yet supported');
  }

  cursor.rewind(1);

  return expression.slice(0, -1);
};
