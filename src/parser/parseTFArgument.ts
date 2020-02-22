import { makeTFArgument } from '@src/makers';
import {
  StringCursor,
  parseTFExpression,
  parseTFIdentifier
} from '@src/parser';
import { TFArgument } from '@src/types';

export const parseTFArgument = (cursor: StringCursor): TFArgument => {
  const identifier = parseTFIdentifier(cursor);
  let leadingInnerText = '';

  leadingInnerText = cursor.collectUntilWithComments('=').slice(0, -1);

  return makeTFArgument(
    identifier, //
    parseTFExpression(cursor),
    { leadingInnerText }
  );
};
