import { makeTFAttribute, makeTFLabel } from '@src/makers';
import {
  StringCursor,
  parseTFExpression,
  parseTFIdentifier
} from '@src/parser';
import { TFAttribute, TFAttributeKey } from '@src/types';

/**
 * Parses the key for a {@link TFAttribute}.
 *
 * The key is a `TFIdentifier` unless surrounded by quotes,
 * in which case it's a `TFLabel` node.
 *
 * @param {StringCursor} cursor
 *
 * @return {TFAttributeKey}
 */
const parseTFAttributeKey = (cursor: StringCursor): TFAttributeKey => {
  const key = parseTFIdentifier(cursor);

  if (['"', "'"].includes(key.value[0])) {
    return makeTFLabel(key.value, key.surroundingText);
  }

  return key;
};

export const parseTFAttribute = (cursor: StringCursor): TFAttribute => {
  const key = parseTFAttributeKey(cursor);
  let leadingInnerText = '';

  leadingInnerText = cursor.collectUntilWithComments('=').slice(0, -1);

  const value = parseTFExpression(cursor);

  // if(value.)

  return makeTFAttribute(
    key, //
    value,
    { leadingInnerText }
  );
};
