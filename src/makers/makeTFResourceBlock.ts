import {
  TFRoute53RecordResource,
  TFRoute53ZoneResource,
  TFS3BucketResource
} from '@src/builders';
import {
  ResourceType,
  TFBlockBody,
  TFNodeType,
  TFResourceBlock
} from '@src/types';
import { AwsResourceType } from '@src/utils';

interface ResourceIdentifierMap {
  [AwsResourceType.AWS_ROUTE53_RECORD]: keyof TFRoute53RecordResource;
  [AwsResourceType.AWS_ROUTE53_ZONE]: keyof TFRoute53ZoneResource;
  [AwsResourceType.AWS_S3_BUCKET]: keyof TFS3BucketResource;
  [k: string]: string;
}

export const makeTFResourceBlock = <TResource extends ResourceType>(
  name: string,
  resource: TResource,
  body: TFBlockBody<ResourceIdentifierMap[TResource]>
): TFResourceBlock<ResourceIdentifierMap[TResource]> => ({
  type: TFNodeType.Resource,
  name,
  resource,
  body
});
