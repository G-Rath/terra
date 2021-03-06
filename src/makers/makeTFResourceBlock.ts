import {
  TFEC2EIPResource,
  TFIAMGroupResource,
  TFIAMUserResource,
  TFRoute53RecordResource,
  TFRoute53ZoneResource,
  TFS3BucketResource,
  TFSecretsManagerSecretResource
} from '@src/builders';
import { makeTFBlockBody, makeTFLabel } from '@src/makers';
import {
  ResourceType,
  TFBlockBody,
  TFBlockBodyBody,
  TFNodeType,
  TFResourceBlock
} from '@src/types';
import type { AwsResourceType } from '@src/utils';

interface ResourceIdentifierMap {
  [AwsResourceType.AWS_IAM_GROUP]: keyof TFIAMGroupResource;
  [AwsResourceType.AWS_IAM_USER]: keyof TFIAMUserResource;
  [AwsResourceType.AWS_ROUTE53_RECORD]: keyof TFRoute53RecordResource;
  [AwsResourceType.AWS_ROUTE53_ZONE]: keyof TFRoute53ZoneResource;
  [AwsResourceType.AWS_S3_BUCKET]: keyof TFS3BucketResource;
  [AwsResourceType.AWS_SECRETSMANAGER_SECRET]: keyof TFSecretsManagerSecretResource;
  [AwsResourceType.AWS_EIP]: keyof TFEC2EIPResource;
  [k: string]: string;
}

export const makeTFResourceBlock = <TResource extends ResourceType>(
  resource: TResource,
  name: string,
  body:
    | TFBlockBody<ResourceIdentifierMap[TResource]>
    | TFBlockBodyBody<ResourceIdentifierMap[TResource]>,
  surroundingText?: Partial<TFResourceBlock['surroundingText']>
): TFResourceBlock<ResourceIdentifierMap[TResource]> => ({
  type: TFNodeType.Block,
  blockType: 'resource',
  labels: [makeTFLabel(resource), makeTFLabel(name)],
  body: Array.isArray(body) ? makeTFBlockBody(body) : body,
  surroundingText: {
    leadingOuterText: '',
    trailingOuterText: '',
    ...surroundingText
  }
});
