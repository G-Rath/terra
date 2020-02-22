import { makeTFBlock } from '@src/makers';
import { StringCursor, parseTFBlockBody, parseTFLabel } from '@src/parser';
import { TFBlock, TFLabel } from '@src/types';

export const parseTFBlock = (cursor: StringCursor): TFBlock => {
  const leadingOuterText = cursor.collectUntilWithComments(/\w/u).slice(0, -1);
  cursor.rewind(1);

  const blockType = cursor.collectUntil(/\W/u).slice(0, -1);

  cursor.rewind(1);

  const labels: TFLabel[] = [];

  do {
    const text = cursor.collectUntilWithComments([/\w/u, '{', '"']);
    cursor.rewind(text.length);

    if (text.endsWith('{')) {
      break;
    }

    labels.push(parseTFLabel(cursor));
  } while (cursor.char);

  return makeTFBlock(blockType, labels, parseTFBlockBody(cursor), {
    leadingOuterText
  });
};
