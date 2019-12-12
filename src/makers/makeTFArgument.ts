import { TFArgument, TFLiteralExpression, TFNodeType } from '@src/types';

export const makeTFArgument = <TIdentifier extends string = string>(
  identifier: TIdentifier,
  expression: TFLiteralExpression,
  surroundingText?: Partial<TFArgument['surroundingText']>
): TFArgument<TIdentifier> => ({
  type: TFNodeType.Argument,
  identifier,
  expression,
  surroundingText: {
    leadingInnerText: '',
    trailingInnerText: '',
    ...surroundingText
  }
});
