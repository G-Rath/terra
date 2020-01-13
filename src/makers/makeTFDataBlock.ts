import { makeTFBlockBody, makeTFLabel } from '@src/makers';
import {
  DataType,
  TFBlockBody,
  TFBlockBodyBody,
  TFDataBlock,
  TFNodeType
} from '@src/types';

interface DataIdentifierMap {
  [k: string]: string;
}

export const makeTFDataBlock = <TData extends DataType>(
  data: TData,
  name: string,
  body:
    | TFBlockBody<DataIdentifierMap[TData]>
    | TFBlockBodyBody<DataIdentifierMap[TData]>,
  surroundingText?: Partial<TFDataBlock['surroundingText']>
): TFDataBlock<DataIdentifierMap[TData]> => ({
  type: TFNodeType.Block,
  blockType: 'data',
  labels: [makeTFLabel(data), makeTFLabel(name)],
  body: Array.isArray(body) ? makeTFBlockBody(body) : body,
  surroundingText: {
    leadingOuterText: '',
    trailingOuterText: '',
    ...surroundingText
  }
});
