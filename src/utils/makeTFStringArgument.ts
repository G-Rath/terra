import { TFArgument } from '@src/types';
import { makeTFArgument } from '@src/utils';

export const makeTFStringArgument = <TIdentifier extends string = string>(
  identifier: TIdentifier,
  expression: string
): TFArgument<TIdentifier> => makeTFArgument(identifier, `"${expression}"`);
