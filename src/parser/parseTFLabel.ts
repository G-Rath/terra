import { makeTFLabel } from '@src/makers';
import { StringCursor } from '@src/parser';
import type { TFLabel } from '@src/types';
import { assertQuotedStringIsClosed } from '@src/utils';

export const parseTFLabel = (cursor: StringCursor): TFLabel => {
  const leadingOuterText = cursor
    .collectUntilWithComments(/["\w]/u)
    .slice(0, -1);

  cursor.rewind(1);

  let label = cursor.advance();

  label += cursor.collectUntil([
    '/*', //
    '\n',
    '"',
    '[',
    '{',
    label.startsWith('"') ? '"' : ' '
  ]);

  if (label.endsWith('"') && !label.startsWith('"')) {
    throw new Error('missing opening " quote');
  }

  // anything other than " is leading text of the next node
  if (!label.endsWith('"')) {
    const rewindBy = label.endsWith('/*') ? 2 : 1;

    label = label.slice(0, -rewindBy);
    cursor.rewind(rewindBy);
  }

  assertQuotedStringIsClosed(label);

  return makeTFLabel(label, {
    leadingOuterText
  });
};
