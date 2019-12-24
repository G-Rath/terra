import { TFMapExpression, TFNodeType, TFAttribute } from '@src/types';

export const makeTFMapExpression = <TKey extends string = string>(
  attributes: Array<TFAttribute<TKey>>,
  surroundingText?: Partial<TFMapExpression['surroundingText']>
): TFMapExpression<TKey> => ({
  type: TFNodeType.Map,
  attributes,
  surroundingText: {
    leadingInnerText: '',
    leadingOuterText: '',
    trailingInnerText: '',
    trailingOuterText: '',
    ...surroundingText
  }
});
