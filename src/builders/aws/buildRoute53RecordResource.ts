import {
  TFArgument,
  TFBlockBody,
  TFBlockLiteral,
  TFNodeType,
  TFResourceBlock
} from '@src/types';
import {
  asResourceName,
  AwsResourceType,
  makeTFArgument,
  makeTFStringArgument,
  normaliseRoute53Name
} from '@src/utils';
import { Route53 } from 'aws-sdk';

interface TFRoute53WeightedRoutingPolicy {
  weight: number;
}

interface TFRoute53FailOverRoutingPolicy {
  type: 'PRIMARY' | 'SECONDARY';
}

export interface TFRoute53RecordAlias {
  zone_id: string;
  name: string;
  evaluate_target_health: boolean;
}

interface TFRoute53RecordAttributes {
  name: string;
  fqdn: string;
}

type TFRoute53RecordResource =
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
  aliasTarget: Route53.AliasTarget
): TFBlockLiteral<keyof TFRoute53RecordAlias> => ({
  type: TFNodeType.Block,
  name: 'alias',
  body: [
    makeTFStringArgument('zone_id', aliasTarget.HostedZoneId),
    makeTFStringArgument('name', aliasTarget.DNSName),
    makeTFArgument('evaluate_target_health', aliasTarget.EvaluateTargetHealth)
  ]
});

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
 * @param {Route53.ResourceRecordSet} resourceRecordSet
 *
 * @return {Array<TFArgument<keyof TFRoute53RecordResource>> | [TFBlockLiteral<keyof TFRoute53RecordAlias>]}
 *
 * @todo support strict validation of either `AliasTarget` or `TTL` being defined
 */
const buildRecordsArgumentsOrAliasBlock = (
  resourceRecordSet: Route53.ResourceRecordSet
):
  | Array<TFArgument<keyof TFRoute53RecordResource>>
  | [TFBlockLiteral<keyof TFRoute53RecordAlias>] => {
  if (resourceRecordSet.AliasTarget !== undefined) {
    return [buildAliasBlock(resourceRecordSet.AliasTarget)];
  }

  if (resourceRecordSet.TTL === undefined) {
    return []; // todo: strict validation
  }

  return [
    makeTFArgument('ttl', resourceRecordSet.TTL),
    makeTFArgument(
      'records',
      (resourceRecordSet.ResourceRecords || []).map(({ Value }) => `"${Value}"`)
    )
  ];
};

/**
 * Builds a Route53 Terraform Resource.
 *
 * @param {Route53.HostedZone} resourceRecordSet
 * @param {string} zoneId
 * @param {string} zoneName
 *
 * @return {TFResourceBlock<keyof TFRoute53ZoneResource>}
 *
 * @todo support stripping out "HostedZone created by Route53 Registrar"
 * @todo support policy arguments
 * @todo support private zones
 */
export const buildRoute53RecordResource = (
  resourceRecordSet: Route53.ResourceRecordSet,
  zoneId: string,
  zoneName: string
): TFResourceBlock<keyof TFRoute53RecordResource> => {
  const normalZoneName = normaliseRoute53Name(zoneName);
  const normalRecordName = normaliseRoute53Name(
    resourceRecordSet.Name,
    normalZoneName
  );

  const body: TFBlockBody<keyof TFRoute53RecordResource> = [
    makeTFStringArgument('name', normalRecordName),
    makeTFStringArgument('type', resourceRecordSet.Type),
    ...buildRecordsArgumentsOrAliasBlock(resourceRecordSet),
    makeTFStringArgument('zone_id', zoneId)
  ];

  return {
    type: TFNodeType.Resource,
    resource: AwsResourceType.AWS_ROUTE53_RECORD,
    name: buildRecordResourceName(
      normalZoneName,
      normalRecordName,
      resourceRecordSet.Type
    ),
    body
  };
};
