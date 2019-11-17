import { TFBlockBody, TFBlockLiteral, TFNodeType } from '@src/types';

export const makeTFBlockLiteral = <TIdentifier extends string = string>(
  name: string,
  body: TFBlockBody<TIdentifier>
): TFBlockLiteral<TIdentifier> => ({
  type: TFNodeType.Block,
  name,
  body
});
