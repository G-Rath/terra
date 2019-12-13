import { makeTFBlockBody } from '@src/makers/makeTFBlockBody';
import {
  TFBlockBody,
  TFBlockBodyBody,
  TFBlockLiteral,
  TFNodeType
} from '@src/types';

export const makeTFBlockLiteral = <TIdentifier extends string = string>(
  name: string,
  body: TFBlockBody<TIdentifier> | TFBlockBodyBody<TIdentifier>
): TFBlockLiteral<TIdentifier> => ({
  type: TFNodeType.Block,
  name,
  body: Array.isArray(body) ? makeTFBlockBody(body) : body
});
