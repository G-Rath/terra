import { makeTFIdentifier } from '@src/makers';
import { StringCursor } from '@src/parser';
import type { TFIdentifier } from '@src/types';
import { assertQuotedStringIsClosed } from '@src/utils';

export const parseTFIdentifier = (cursor: StringCursor): TFIdentifier => {
  const leadingOuterText = cursor
    .collectUntilWithComments(/["'\w]/u)
    .slice(0, -1);

  cursor.rewind(1);

  let identifier = cursor.advance();

  identifier += cursor.collectUntil(/[^\w-]/u).slice(0, -1);

  cursor.rewind(1);

  if (['"', "'"].includes(cursor.char)) {
    identifier += cursor.advance();
  }

  if (identifier.endsWith('"') && !identifier.startsWith('"')) {
    throw new Error('missing opening " quote');
  }

  assertQuotedStringIsClosed(identifier);

  return makeTFIdentifier(identifier, {
    leadingOuterText
  });
};
