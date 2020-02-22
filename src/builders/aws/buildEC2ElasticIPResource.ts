import {
  makeTFArgument,
  makeTFAttribute,
  makeTFMapExpression,
  makeTFResourceBlock,
  makeTFStringArgument
} from '@src/makers';
import { TFBlockBodyBody, TFResourceBlock } from '@src/types';
import { AwsResourceType, asResourceName } from '@src/utils';

interface TFEC2EIPAttributes {
  id: string;
  private_ip: string;
  private_dns: string;
  associate_with_provide_ip: string;
  public_ip: string;
  public_dns: string;
  instance: string;
  network_interface: string;
  public_ipv4_pool: string;
}

export interface TFEC2EIPResource {
  vpc?: boolean;
  instance?: string;
  network_interface?: string;
  associate_with_private_ip?: string;
  tags?: Record<string, string>;
  public_ipv4_pool?: string;
}

export interface EC2ElasticIPDetails {
  allocationId: string;
  association?: {
    id: string;
    method: 'instance' | 'network_interface';
  };
  publicIPv4Pool: string | 'amazon';
  isInVPC: boolean;
  tags: Array<[string, string]>;
}

/**
 * Builds an EC2 EIP Terraform Resource.
 *
 * @param {EC2ElasticIPDetails} details
 *
 * @return {TFResourceBlock<keyof TFEC2EIPResource>}
 */
export const buildEC2ElasticIPResource = (
  details: EC2ElasticIPDetails
): TFResourceBlock<keyof TFEC2EIPResource> => {
  const body: TFBlockBodyBody<keyof TFEC2EIPResource> = [];

  if (details.isInVPC) {
    body.push(makeTFArgument('vpc', `${details.isInVPC}`));
  }

  if (details.association) {
    body.push(
      makeTFStringArgument(details.association.method, details.association.id)
    );
  }

  if (details.publicIPv4Pool !== 'amazon') {
    body.push(makeTFStringArgument('public_ipv4_pool', details.publicIPv4Pool));
  }

  if (details.tags.length) {
    body.push(
      makeTFArgument(
        'tags',
        makeTFMapExpression(details.tags.map(([k, v]) => makeTFAttribute(k, v)))
      )
    );
  }

  return makeTFResourceBlock(
    AwsResourceType.AWS_EIP,
    asResourceName(details.allocationId),
    body
  );
};
