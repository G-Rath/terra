import { makeTFResourceBlock, makeTFStringArgument } from '@src/makers';
import { TFBlockBodyBody, TFResourceBlock } from '@src/types';
import { AwsResourceType, asResourceName } from '@src/utils';

export interface TFIAMGroupResource {
  name: string;
  path?: string;
}

export interface IAMGroupDetails {
  name: string;
  path?: string;
}

/**
 * Builds an IAM Group resource in Terraform.
 */
export const buildIAMGroupResource = (
  details: IAMGroupDetails
): TFResourceBlock<keyof TFIAMGroupResource> => {
  const body: TFBlockBodyBody<keyof TFIAMGroupResource> = [
    makeTFStringArgument('name', details.name)
  ];

  if (details.path) {
    body.push(makeTFStringArgument('path', details.path));
  }

  return makeTFResourceBlock(
    AwsResourceType.AWS_IAM_GROUP,
    asResourceName(details.name),
    body
  );
};
