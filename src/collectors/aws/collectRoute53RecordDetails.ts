import {
  Route53RecordDetails,
  Route53RecordTargetDetails,
  Route53ZoneDetails
} from '@src/builders';
import { Route53 } from 'aws-sdk';

const buildTargetDetailsFromResourceRecordSet = (
  recordSet: Route53.ResourceRecordSet
): Route53RecordTargetDetails => {
  if (recordSet.AliasTarget) {
    return {
      evaluateTargetHealth: recordSet.AliasTarget.EvaluateTargetHealth,
      hostedZoneId: recordSet.AliasTarget.HostedZoneId,
      dnsName: recordSet.AliasTarget.DNSName
    };
  }

  if (recordSet.TTL === undefined) {
    throw new Error('TTL and AliasTarget cannot both be undefined');
  }

  return {
    ttl: recordSet.TTL,
    records: (recordSet.ResourceRecords ?? []).map(({ Value }) => Value)
  };
};

/**
 * Collects the details required to build a representation
 * of the Route53 Records for the given hosted zone in Terraform.
 */
export const collectRoute53RecordDetails = async ({
  name: zoneName,
  id: zoneId
}: Route53ZoneDetails): Promise<Route53RecordDetails[]> => {
  const route53 = new Route53();
  const recordDetails: Route53RecordDetails[] = [];
  let response: Route53.ListResourceRecordSetsResponse | undefined;

  do {
    response = await route53
      .listResourceRecordSets({
        HostedZoneId: zoneId,
        ...(response && {
          StartRecordIdentifier: response.NextRecordIdentifier,
          StartRecordName: response.NextRecordName,
          StartRecordType: response.NextRecordType
        })
      })
      .promise();

    recordDetails.push(
      ...response.ResourceRecordSets.map<Route53RecordDetails>(set => ({
        name: set.Name,
        target: buildTargetDetailsFromResourceRecordSet(set),
        type: set.Type,
        zoneId,
        zoneName
      }))
    );
  } while (response.IsTruncated);

  return recordDetails;
};
