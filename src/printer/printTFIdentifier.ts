import { TFIdentifier } from '@src/types';

export const printTFIdentifier = (identifier: TFIdentifier): string =>
  [
    identifier.surroundingText.leadingOuterText,
    identifier.value,
    identifier.surroundingText.trailingOuterText
  ].join('');
