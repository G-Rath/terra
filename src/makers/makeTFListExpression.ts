import { makeTFSimpleLiteral } from '@src/makers';
import { TFListExpression, TFLiteralExpression, TFNodeType } from '@src/types';

export const makeTFListExpression = (
  values: Array<TFLiteralExpression | string>,
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
  values: values.map(v => (typeof v === 'string' ? makeTFSimpleLiteral(v) : v))
});
