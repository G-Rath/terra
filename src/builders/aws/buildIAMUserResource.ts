import {
  makeTFArgument,
  makeTFResourceBlock,
  makeTFStringArgument
} from '@src/makers';
import type { TFBlockBodyBody, TFResourceBlock } from '@src/types';
import { AwsResourceType, asResourceName } from '@src/utils';

export interface TFIAMUserResource {
  name: string;
  path?: string;
  permissions_boundary?: string;
  force_destroy?: boolean;
}

export interface IAMUserDetails {
  name: string;
  path?: string;
  permissionsBoundaryArn?: string;
  forceDestroy?: boolean;
}

/**
 * Builds an IAM User resource in Terraform.
 */
export const buildIAMUserResource = (
  details: IAMUserDetails
): TFResourceBlock<keyof TFIAMUserResource> => {
  const body: TFBlockBodyBody<keyof TFIAMUserResource> = [
    makeTFStringArgument('name', details.name)
  ];

  if (details.path) {
    body.push(makeTFStringArgument('path', details.path));
  }

  if (details.permissionsBoundaryArn) {
    body.push(
      makeTFStringArgument(
        'permissions_boundary',
        details.permissionsBoundaryArn
      )
    );
  }

  if (typeof details.forceDestroy === 'boolean') {
    body.push(makeTFArgument('force_destroy', `${details.forceDestroy}`));
  }

  return makeTFResourceBlock(
    AwsResourceType.AWS_IAM_USER,
    asResourceName(details.name),
    body
  );
};
