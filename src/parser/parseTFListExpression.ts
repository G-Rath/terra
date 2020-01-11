import { makeTFListExpression } from '@src/makers';
import { parseTFExpression, StringCursor } from '@src/parser';
import { TFListExpression, TFLiteralExpression } from '@src/types';

export const parseTFListExpression = (
  cursor: StringCursor
): TFListExpression => {
  // the text leading up to the list; the last char is the start of the list
  const leadingOuterText = cursor.collectUntilWithComments(/\[/u).slice(0, -1);

  const values: TFLiteralExpression[] = [];
  let hasTrailingComma = false;

  do {
    const trailingInnerText = cursor.collectUntilWithComments([
      /[^\n /]/u,
      ']'
    ]);

    if (trailingInnerText.endsWith(']')) {
      return makeTFListExpression(
        values, //
        hasTrailingComma,
        {
          leadingOuterText,
          trailingInnerText: trailingInnerText.slice(0, -1)
        }
      );
    }

    cursor.rewind(trailingInnerText.length);
    hasTrailingComma = false;
    values.push(parseTFExpression(cursor));

    if (cursor.char === ',') {
      hasTrailingComma = true;
      cursor.advance();
    }
  } while (cursor.char);

  throw new Error('unreachable');
};
