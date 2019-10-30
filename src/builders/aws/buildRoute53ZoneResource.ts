import { TFBlockBody, TFNodeType, TFResourceBlock } from '@src/types';
import {
  asResourceName,
  AwsResourceType,
  normaliseRoute53Name
} from '@src/utils';
import { Route53 } from 'aws-sdk';

interface TFRoute53VPC {
  vpc_id: string;
  vpc_region?: string;
}

interface TFRoute53ZoneAttributes {
  zone_id: string;
  name_servers: string[];
}

type TFRoute53ZoneResource =
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

/**
 * Builds a Route53 Terraform Resource.
 *
 * @param {Route53.HostedZone} hostedZone
 *
 * @return {TFResourceBlock<keyof TFRoute53ZoneResource>}
 *
 * @todo support stripping out "HostedZone created by Route53 Registrar"
 * @todo support private zones
 */
export const buildRoute53ZoneResource = (
  hostedZone: Route53.HostedZone
): TFResourceBlock<keyof TFRoute53ZoneResource> => {
  const normalisedZoneName = normaliseRoute53Name(hostedZone.Name);
  const body: TFBlockBody<keyof TFRoute53ZoneResource> = [
    {
      type: TFNodeType.Argument,
      identifier: 'name',
      expression: `"${normalisedZoneName}"`
    }
  ];

  if (hostedZone.Config) {
    if (hostedZone.Config.Comment) {
      body.push({
        type: TFNodeType.Argument,
        identifier: 'comment',
        expression: `"${hostedZone.Config.Comment}"`
      });
    }
  }

  return {
    type: TFNodeType.Resource,
    resource: AwsResourceType.AWS_ROUTE53_ZONE,
    name: asResourceName(normalisedZoneName),
    body
  };
};
