import { TFNodeType, TFSimpleLiteral } from '@src/types';

export const makeTFSimpleLiteral = (
  value: string,
  surroundingText?: Partial<TFSimpleLiteral['surroundingText']>
): TFSimpleLiteral => ({
  type: TFNodeType.Simple,
  value,
  surroundingText: {
    leadingOuterText: '',
    trailingOuterText: '',
    ...surroundingText
  }
});
