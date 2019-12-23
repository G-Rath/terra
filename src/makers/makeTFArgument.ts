import {
  makeTFIdentifier,
  makeTFListExpression,
  makeTFSimpleLiteral
} from '@src/makers';
import {
  TFArgument,
  TFIdentifier,
  TFLiteralExpression,
  TFNodeType
} from '@src/types';

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
  identifier: TIdentifier | TFIdentifier<TIdentifier>,
  expression:
    | TFLiteralExpression
    | string
    | Array<TFLiteralExpression | string>,
  surroundingText?: Partial<TFArgument['surroundingText']>
): TFArgument<TIdentifier> => ({
  type: TFNodeType.Argument,
  identifier:
    typeof identifier === 'string' //
      ? makeTFIdentifier(identifier)
      : identifier,
  expression: buildExpression(expression),
  surroundingText: {
    leadingInnerText: '',
    trailingInnerText: '',
    ...surroundingText
  }
});
