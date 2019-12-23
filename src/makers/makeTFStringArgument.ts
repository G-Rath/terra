import { makeTFArgument } from '@src/makers';
import { TFArgument, TFIdentifier } from '@src/types';

export const makeTFStringArgument = <TIdentifier extends string = string>(
  identifier: TIdentifier | TFIdentifier<TIdentifier>,
  expression: string,
  surroundingText?: Partial<TFArgument['surroundingText']>
): TFArgument<TIdentifier> =>
  makeTFArgument(identifier, `"${expression}"`, surroundingText);
