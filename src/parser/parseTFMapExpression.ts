import { makeTFMapExpression } from '@src/makers';
import { parseTFAttribute, StringCursor } from '@src/parser';
import { TFAttribute, TFMapExpression } from '@src/types';

export const parseTFMapExpression = (cursor: StringCursor): TFMapExpression => {
  let leadingOuterText = '';

  leadingOuterText = cursor.collectUntilWithComments('{').slice(0, -1);

  let trailingInnerText = '';
  const attributes: TFAttribute[] = [];

  do {
    trailingInnerText = cursor.collectUntilWithComments([/\w/u, '}']);

    if (trailingInnerText.endsWith('}')) {
      trailingInnerText = trailingInnerText.slice(0, -1);

      break;
    }

    cursor.rewind(trailingInnerText.length);

    attributes.push(parseTFAttribute(cursor));
  } while (cursor.char);

  return makeTFMapExpression(attributes, {
    leadingOuterText,
    trailingInnerText
  });
};
