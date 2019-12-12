import { makeTFArgument } from '@src/makers';
import { TFArgument } from '@src/types';

export const makeTFStringArgument = <TIdentifier extends string = string>(
  identifier: TIdentifier,
  expression: string,
  surroundingText?: Partial<TFArgument['surroundingText']>
): TFArgument<TIdentifier> =>
  makeTFArgument(identifier, `"${expression}"`, surroundingText);
