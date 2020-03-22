import { makeTFResourceBlock, makeTFStringArgument } from '@src/makers';
import type { TFBlockBodyBody, TFResourceBlock } from '@src/types';
import {
  AwsResourceType,
  asResourceName,
  normaliseRoute53Name
} from '@src/utils';

interface TFRoute53VPC {
  vpc_id: string;
  vpc_region?: string;
}

interface TFRoute53ZoneAttributes {
  zone_id: string;
  name_servers: string[];
}

export type TFRoute53ZoneResource =
  | TFPrivateRoute53ZoneResource
  | TFPublicRoute53ZoneResource;

interface TFPrivateRoute53ZoneResource {
  name: string;
  comment?: string;
  force_destroy?: boolean;
  tags?: Record<string, string>;
  vpc?: TFRoute53VPC;
  delegation_set_id?: undefined;
}

interface TFPublicRoute53ZoneResource {
  name: string;
  comment?: string;
  force_destroy?: boolean;
  tags?: Record<string, string>;
  vpc?: undefined;
  delegation_set_id?: string;
}

export interface Route53ZoneDetails {
  id: string;
  name: string;
  comment?: string;
  isPrivate: boolean;
}

/**
 * Builds a Route53 Terraform Resource.
 *
 * @param {Route53ZoneDetails} details
 *
 * @return {TFResourceBlock<keyof TFRoute53ZoneResource>}
 *
 * @todo support stripping out "HostedZone created by Route53 Registrar"
 * @todo support private zones
 */
export const buildRoute53ZoneResource = (
  details: Route53ZoneDetails
): TFResourceBlock<keyof TFRoute53ZoneResource> => {
  const normalisedZoneName = normaliseRoute53Name(details.name);
  const body: TFBlockBodyBody<keyof TFRoute53ZoneResource> = [
    makeTFStringArgument('name', normalisedZoneName)
  ];

  if (details.comment) {
    body.push(makeTFStringArgument('comment', details.comment));
  }

  return makeTFResourceBlock(
    AwsResourceType.AWS_ROUTE53_ZONE,
    asResourceName(normalisedZoneName),
    body
  );
};
