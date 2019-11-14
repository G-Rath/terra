import { Route53ZoneDetails } from '@src/builders';
import { Route53 } from 'aws-sdk';

/**
 * Collects the details required to build a representation
 * of the specified Route53 Zone in Terraform.
 */
export const collectRoute53ZoneDetails = async (
  zoneId: string
): Promise<Route53ZoneDetails> => {
  const route53 = new Route53();

  const { HostedZone: hostedZone } = await route53
    .getHostedZone({ Id: zoneId })
    .promise();

  return {
    id: hostedZone.Id,
    name: hostedZone.Name,
    comment: hostedZone.Config?.Comment,
    isPrivate: hostedZone.Config?.PrivateZone ?? false
  };
};
