import { makeTFFunctionExpression } from '@src/makers';
import {
  parseTFExpression,
  parseTFIdentifier,
  StringCursor
} from '@src/parser';
import { TFFunctionExpression, TFLiteralExpression } from '@src/types';

export const parseTFFunctionExpression = (
  cursor: StringCursor
): TFFunctionExpression => {
  const name = parseTFIdentifier(cursor);
  const leadingOuterText: string = cursor
    .collectUntilWithComments('(')
    .slice(0, -1);

  const args: TFLiteralExpression[] = [];
  let hasTrailingComma = false;

  do {
    const trailingInnerText = cursor.collectUntilWithComments([/[^\n /]/, ')']);

    if (trailingInnerText.endsWith(')')) {
      return makeTFFunctionExpression(
        name,
        args,
        hasTrailingComma, //
        {
          leadingOuterText,
          trailingInnerText: trailingInnerText.slice(0, -1)
        }
      );
    }

    cursor.rewind(trailingInnerText.length);
    hasTrailingComma = false;
    args.push(parseTFExpression(cursor));

    if (cursor.char === ',') {
      hasTrailingComma = true;
      cursor.advance();
    }
  } while (cursor.char);

  throw new Error('unreachable');
};
