import { TFIAMPolicyDocument } from '@src/builders';
import { makeTFBlockBody, makeTFLabel } from '@src/makers';
import {
  DataType,
  TFBlockBody,
  TFBlockBodyBody,
  TFDataBlock,
  TFNodeType
} from '@src/types';
import { AwsDataType } from '@src/utils';

interface DataIdentifierMap {
  [AwsDataType.AWS_IAM_ROLE_POLICY_DOCUMENT]: keyof TFIAMPolicyDocument;
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
