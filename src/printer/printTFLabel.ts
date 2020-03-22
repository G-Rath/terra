import type { TFLabel } from '@src/types';

export const printTFLabel = (label: TFLabel): string =>
  [
    label.surroundingText.leadingOuterText,
    label.value,
    label.surroundingText.trailingOuterText
  ].join('');
