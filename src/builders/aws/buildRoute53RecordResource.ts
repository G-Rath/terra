import {
  makeTFArgument,
  makeTFBlock,
  makeTFListExpression,
  makeTFResourceBlock,
  makeTFStringArgument
} from '@src/makers';
import type {
  TFArgument,
  TFBlock,
  TFBlockBodyBody,
  TFResourceBlock
} from '@src/types';
import {
  AwsResourceType,
  asResourceName,
  normaliseRoute53Name
} from '@src/utils';
import { Route53 } from 'aws-sdk';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface TFRoute53WeightedRoutingPolicy {
  weight: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface TFRoute53FailOverRoutingPolicy {
  type: 'PRIMARY' | 'SECONDARY';
}

export interface TFRoute53RecordAlias {
  zone_id: string;
  name: string;
  evaluate_target_health: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface TFRoute53RecordAttributes {
  name: string;
  fqdn: string;
}

export type TFRoute53RecordResource =
  | TFRoute53RecordResourceWithRecords
  | TFRoute53RecordResourceWithAlias;

interface TFRoute53RecordResourceWithRecords {
  name: string;
  zone_id: string;
  type: string;
  alias: never;
  ttl: number;
  records: string[];
  allow_overwrite?: boolean;
  set_identifier?: string;
}

interface TFRoute53RecordResourceWithAlias {
  name: string;
  zone_id: string;
  type: string;
  alias: TFRoute53RecordAlias;
  ttl: never;
  records: never;
  allow_overwrite?: boolean;
  set_identifier?: string;
}

const buildRecordResourceName = (
  zoneName: string,
  recordName: string,
  recordType: string
): string => {
  const parts = [recordType.toLowerCase()];

  if (recordName) {
    parts.unshift(recordName);
  }

  parts.unshift(zoneName);

  return asResourceName(parts.join('_'));
};

const buildAliasBlock = (
  aliasTarget: AliasTargetDetails
): TFBlock<keyof TFRoute53RecordAlias> =>
  makeTFBlock(
    'alias',
    [],
    [
      makeTFStringArgument('zone_id', aliasTarget.hostedZoneId),
      makeTFStringArgument('name', aliasTarget.dnsName),
      makeTFArgument(
        'evaluate_target_health',
        aliasTarget.evaluateTargetHealth ? 'true' : 'false'
      )
    ]
  );

/**
 * Builds either the arguments related to `records`,
 * or `alias` block for an `aws_route53_record`.
 *
 * If the `resourceRecordSet` contains the `AliasTarget` property,
 * then an `alias` block literal is returned.
 *
 * If the `resourceRecordSet` contains the `TTL` property,
 * then the arguments `records` & `ttl` are returned.
 *
 * Otherwise, an empty array is returned.
 *
 * @param {Route53RecordDetails} details
 *
 * @return {Array<TFArgument<keyof TFRoute53RecordResource>> | [TFBlock<keyof TFRoute53RecordAlias>]}
 *
 * @todo support strict validation of either `AliasTarget` or `TTL` being defined
 */
const buildRecordsArgumentsOrAliasBlock = (
  details: Route53RecordDetails
):
  | Array<TFArgument<keyof TFRoute53RecordResource>>
  | [TFBlock<keyof TFRoute53RecordAlias>] => {
  if ('hostedZoneId' in details.target) {
    return [buildAliasBlock(details.target)];
  }

  return [
    makeTFArgument('ttl', `${details.target.ttl}`),
    makeTFArgument(
      'records',
      makeTFListExpression(
        details.target.records.map(v => `"${v.replace(/"/gu, '\\"')}"`)
      )
    )
  ];
};

export interface Route53RecordDetails {
  name: string;
  type: Route53.RRType;
  target: Route53RecordTargetDetails;
  zoneId: string;
  zoneName: string;
}

export type Route53RecordTargetDetails =
  | AliasTargetDetails
  | RecordsTargetDetails;

export interface AliasTargetDetails {
  evaluateTargetHealth: boolean;
  hostedZoneId: string;
  dnsName: string;
}

export interface RecordsTargetDetails {
  records: string[];
  ttl: number;
}

/**
 * Builds a Route53 Terraform Resource.
 *
 * @param {Route53RecordDetails} details
 *
 * @return {TFResourceBlock<keyof TFRoute53ZoneResource>}
 *
 * @todo support stripping out "HostedZone created by Route53 Registrar"
 * @todo support policy arguments
 * @todo support private zones
 */
export const buildRoute53RecordResource = (
  details: Route53RecordDetails
): TFResourceBlock<keyof TFRoute53RecordResource> => {
  const normalZoneName = normaliseRoute53Name(details.zoneName);
  const normalRecordName = normaliseRoute53Name(details.name, normalZoneName);

  const body: TFBlockBodyBody<keyof TFRoute53RecordResource> = [
    makeTFStringArgument('name', normalRecordName),
    makeTFStringArgument('type', details.type),
    ...buildRecordsArgumentsOrAliasBlock(details),
    makeTFStringArgument('zone_id', details.zoneId)
  ];

  return makeTFResourceBlock(
    AwsResourceType.AWS_ROUTE53_RECORD,
    buildRecordResourceName(normalZoneName, normalRecordName, details.type),
    body
  );
};
