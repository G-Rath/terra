import { TFListExpression, TFLiteralExpression, TFNodeType } from '@src/types';

export const makeTFListExpression = (
  values: TFLiteralExpression[],
  hasTrailingComma = false,
  surroundingText?: Partial<TFListExpression['surroundingText']>
): TFListExpression => ({
  type: TFNodeType.List,
  hasTrailingComma,
  surroundingText: {
    leadingInnerText: '',
    leadingOuterText: '',
    trailingInnerText: '',
    trailingOuterText: '',
    ...surroundingText
  },
  values
});
