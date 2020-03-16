import { makeTFHeredocLiteral } from '@src/makers';
import { StringCursor } from '@src/parser';
import { TFHeredocLiteral } from '@src/types';

export const parseTFHeredocLiteral = (
  cursor: StringCursor
): TFHeredocLiteral => {
  const leadingOuterText = cursor.collectUntilWithComments(/<</u).slice(0, -2);

  const indented = cursor.char === '-';

  if (indented) {
    cursor.advance();
  }

  const delimiter = cursor.collectUntil([' ', '\n', '/', '#']).slice(0, -1);

  cursor.rewind(1);

  const leadingInnerText = cursor.collectUntilWithComments('\n');

  const content = cursor.collectUntil(new RegExp(`\n.*${delimiter}`, 'u'));
  const trailingInnerText = content.slice(
    content.lastIndexOf('\n'),
    -delimiter.length
  );

  return makeTFHeredocLiteral(
    delimiter,
    content.slice(0, -trailingInnerText.length - delimiter.length),
    indented,
    {
      leadingOuterText,
      leadingInnerText,
      trailingInnerText,
      trailingOuterText: cursor.collectUntilWithComments('\n')
    }
  );
};
