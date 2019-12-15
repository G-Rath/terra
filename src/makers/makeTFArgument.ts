import { makeTFSimpleLiteral } from '@src/makers/makeTFSimpleLiteral';
import { TFArgument, TFLiteralExpression, TFNodeType } from '@src/types';

export const makeTFArgument = <TIdentifier extends string = string>(
  identifier: TIdentifier,
  expression: TFLiteralExpression | string,
  surroundingText?: Partial<TFArgument['surroundingText']>
): TFArgument<TIdentifier> => ({
  type: TFNodeType.Argument,
  identifier,
  expression:
    typeof expression === 'string'
      ? makeTFSimpleLiteral(expression)
      : expression,
  surroundingText: {
    leadingInnerText: '',
    trailingInnerText: '',
    ...surroundingText
  }
});
