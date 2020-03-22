import {
  printCommaSeparatedLiteralExpressionsWithinBrackets,
  printTFIdentifier
} from '@src/printer';
import type { TFFunctionCall } from '@src/types';

export const printTFFunctionCall = (call: TFFunctionCall): string =>
  [
    printTFIdentifier(call.name),
    printCommaSeparatedLiteralExpressionsWithinBrackets(
      '(',
      call.args,
      call,
      ')'
    )
  ].join('');
