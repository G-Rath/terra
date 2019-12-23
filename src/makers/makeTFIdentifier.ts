import { TFIdentifier, TFNodeType } from '@src/types';

export const makeTFIdentifier = <TValue extends string>(
  value: TValue,
  surroundingText?: Partial<TFIdentifier['surroundingText']>
): TFIdentifier<TValue> => ({
  type: TFNodeType.Identifier,
  value,
  surroundingText: {
    leadingOuterText: '',
    trailingOuterText: '',
    ...surroundingText
  }
});
