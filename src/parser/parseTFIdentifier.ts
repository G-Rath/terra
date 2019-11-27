import { StringCursor } from '@src/parser/StringCursor';

export const parseTFIdentifier = (cursor: StringCursor) => {
  // the text leading up to the identifier; the last char is the start of the identifier
  cursor.collectUntilWithComments(/[\w]/).slice(0, -1);

  cursor.rewind(1);

  let identifier = cursor.advance();

  identifier += cursor.collectUntil([
    '/*', //
    '\n',
    ' '
  ]);

  const rewindBy = identifier.endsWith('/*') ? 2 : 1;

  identifier = identifier.slice(0, -rewindBy);
  cursor.rewind(rewindBy);

  return identifier;
};
