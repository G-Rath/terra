import { TFArgument, TFLiteralExpression, TFNodeType } from '@src/types';

export const makeTFArgument = <TIdentifier extends string = string>(
  identifier: TIdentifier,
  expression: TFLiteralExpression
): TFArgument<TIdentifier> => ({
  type: TFNodeType.Argument,
  identifier,
  expression
});
