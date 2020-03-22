import { printTFIdentifier, printTFLiteralExpression } from '@src/printer';
import type { TFArgument } from '@src/types';

export const printTFArgument = (blockArgument: TFArgument): string =>
  [
    printTFIdentifier(blockArgument.identifier),
    blockArgument.surroundingText.leadingInnerText,
    '=',
    blockArgument.surroundingText.trailingInnerText,
    printTFLiteralExpression(blockArgument.expression)
  ].join('');
