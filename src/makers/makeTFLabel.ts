import { TFLabel, TFNodeType } from '@src/types';

export const makeTFLabel = <TValue extends string>(
  value: TValue,
  surroundingText?: Partial<TFLabel['surroundingText']>
): TFLabel<TValue> => ({
  type: TFNodeType.Label,
  value,
  surroundingText: {
    leadingOuterText: '',
    trailingOuterText: '',
    ...surroundingText
  }
});
