import { makeTFListExpression, makeTFSimpleLiteral } from '@src/makers';
import { TFArgument, TFLiteralExpression, TFNodeType } from '@src/types';

const buildExpression = (
  expression: TFLiteralExpression | string | Array<TFLiteralExpression | string>
): TFLiteralExpression => {
  if (typeof expression === 'string') {
    return makeTFSimpleLiteral(expression);
  }

  if (Array.isArray(expression)) {
    return makeTFListExpression(expression);
  }

  return expression;
};

export const makeTFArgument = <TIdentifier extends string = string>(
  identifier: TIdentifier,
  expression:
    | TFLiteralExpression
    | string
    | Array<TFLiteralExpression | string>,
  surroundingText?: Partial<TFArgument['surroundingText']>
): TFArgument<TIdentifier> => ({
  type: TFNodeType.Argument,
  identifier,
  expression: buildExpression(expression),
  surroundingText: {
    leadingInnerText: '',
    trailingInnerText: '',
    ...surroundingText
  }
});
