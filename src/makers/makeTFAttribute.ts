import {
  makeTFListExpression,
  makeTFAttributeKey,
  makeTFSimpleLiteral
} from '@src/makers';
import {
  TFIdentifier,
  TFLabel,
  TFLiteralExpression,
  TFNodeType,
  TFAttribute,
  TFAttributeValue
} from '@src/types';

const buildValue = (
  value: TFLiteralExpression | string | Array<TFLiteralExpression | string>
): TFAttributeValue => {
  if (typeof value === 'string') {
    return makeTFSimpleLiteral(value);
  }

  if (Array.isArray(value)) {
    return makeTFListExpression(value);
  }

  return value;
};

export const makeTFAttribute = <TKey extends string = string>(
  key: TKey | TFIdentifier<TKey> | TFLabel<TKey>,
  value: TFAttributeValue | string | Array<TFAttributeValue | string>,
  surroundingText?: Partial<TFAttribute['surroundingText']>
): TFAttribute<TKey> => ({
  type: TFNodeType.Attribute,
  key:
    typeof key === 'string' //
      ? makeTFAttributeKey(key)
      : key,
  value: buildValue(value),
  surroundingText: {
    leadingInnerText: '',
    trailingInnerText: '',
    ...surroundingText
  }
});
