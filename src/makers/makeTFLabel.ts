import { TFLabel, TFNodeType } from '@src/types';

export const makeTFLabel = (
  value: string,
  surroundingText?: Partial<TFLabel['surroundingText']>
): TFLabel => ({
  type: TFNodeType.Label,
  value,
  surroundingText: {
    leadingOuterText: '',
    trailingOuterText: '',
    ...surroundingText
  }
});
