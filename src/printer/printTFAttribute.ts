import {
  printTFIdentifier,
  printTFLabel,
  printTFLiteralExpression
} from '@src/printer';
import { TFNodeType, TFAttribute } from '@src/types';

export const printTFAttribute = (attribute: TFAttribute): string =>
  [
    attribute.key.type === TFNodeType.Identifier
      ? printTFIdentifier(attribute.key)
      : printTFLabel(attribute.key),
    attribute.surroundingText.leadingInnerText,
    '=',
    attribute.surroundingText.trailingInnerText,
    printTFLiteralExpression(attribute.value)
  ].join('');
