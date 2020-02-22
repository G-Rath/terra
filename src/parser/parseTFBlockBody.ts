import { makeTFBlockBody } from '@src/makers';
import { StringCursor, parseTFArgument, parseTFBlock } from '@src/parser';
import { TFBlockBody, TFBlockBodyBody } from '@src/types';

export const parseTFBlockBody = (cursor: StringCursor): TFBlockBody => {
  let leadingOuterText = '';

  leadingOuterText = cursor.collectUntilWithComments('{').slice(0, -1);

  let trailingInnerText = '';
  const body: TFBlockBodyBody = [];

  do {
    trailingInnerText = cursor.collectUntilWithComments([/\w/u, '}']);

    if (trailingInnerText.endsWith('}')) {
      trailingInnerText = trailingInnerText.slice(0, -1);

      break;
    }

    cursor.rewind(trailingInnerText.length);

    const text = cursor.collectUntilWithComments(['=', '{']);

    cursor.rewind(text.length);

    if (text.endsWith('=')) {
      body.push(parseTFArgument(cursor));

      continue;
    }

    if (text.endsWith('{')) {
      body.push(parseTFBlock(cursor));

      continue;
    }

    throw new Error('No idea how we got here');
  } while (cursor.char);

  return makeTFBlockBody(body, {
    leadingOuterText,
    trailingInnerText
  });
};
