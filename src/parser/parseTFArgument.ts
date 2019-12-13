import { makeTFArgument } from '@src/makers';
import {
  parseTFExpression,
  parseTFIdentifier,
  StringCursor
} from '@src/parser';
import { TFArgument } from '@src/types';

export const parseTFArgument = (cursor: StringCursor): TFArgument => {
  const identifier = parseTFIdentifier(cursor);
  let leadingInnerText = '';

  if (cursor.char !== '=') {
    leadingInnerText = cursor.collectUntil('=').slice(0, -1);
  }

  return makeTFArgument(
    identifier, //
    parseTFExpression(cursor),
    { leadingInnerText }
  );
};