import type {
  AliasTargetDetails,
  RecordsTargetDetails,
  Route53ZoneDetails
} from '@src/builders';
import { collectRoute53RecordDetails } from '@src/collectors';
import { mockAwsClientEndpoints } from '@test/setupAwsSdkMock';
import { Route53 } from 'aws-sdk';

const {
  listResourceRecordSets: listResourceRecordSetsMock //
} = mockAwsClientEndpoints('Route53', {
  listResourceRecordSets: jest.fn<
    Promise<Route53.ListResourceRecordSetsResponse>,
    unknown[]
  >()
});

const buildResourceRecordSet = (
  name: string,
  type: Route53.RRType,
  extra: Partial<Route53.ResourceRecordSet> = {}
): Route53.ResourceRecordSet => ({
  Name: name,
  Type: type,
  ...extra
});

describe('collectRoute53RecordDetails', () => {
  const hostedZone: Route53ZoneDetails = {
    id: '/HostedZone/123456789',
    name: 'my.zone.com.',
    isPrivate: false
  };

  beforeEach(() =>
    listResourceRecordSetsMock.mockResolvedValue({
      ResourceRecordSets: [
        buildResourceRecordSet('my.zone.com.', 'A', { TTL: 300 }),
        buildResourceRecordSet('wow.zone.com.', 'A', {
          AliasTarget: {
            HostedZoneId: '/HostedZone/987654321',
            EvaluateTargetHealth: true,
            DNSName: 'my-dns'
          }
        }),
        buildResourceRecordSet('www.zone.com.', 'A', { TTL: 1200 })
      ],
      IsTruncated: false,
      MaxItems: '1'
    })
  );

  it('processes every record set', async () => {
    const recordDetails = await collectRoute53RecordDetails(hostedZone);

    expect(recordDetails).toHaveLength(3);
  });

  describe('when a record has an AliasTarget', () => {
    beforeEach(() => {
      listResourceRecordSetsMock.mockResolvedValue({
        ResourceRecordSets: [
          buildResourceRecordSet('wow.zone.com.', 'A', {
            AliasTarget: {
              HostedZoneId: '/HostedZone/987654321',
              EvaluateTargetHealth: true,
              DNSName: 'my-dns'
            }
          })
        ],
        IsTruncated: false,
        MaxItems: '1'
      });
    });

    it('details the target expectedly', async () => {
      const [{ target }] = await collectRoute53RecordDetails(hostedZone);

      expect(target).toStrictEqual<AliasTargetDetails>({
        hostedZoneId: '/HostedZone/987654321',
        evaluateTargetHealth: true,
        dnsName: 'my-dns'
      });
    });
  });

  describe('when a record has a TTL', () => {
    beforeEach(() => {
      listResourceRecordSetsMock.mockResolvedValue({
        ResourceRecordSets: [
          buildResourceRecordSet('wow.zone.com.', 'A', {
            TTL: 300,
            ResourceRecords: [{ Value: '192.168.1.1' }]
          })
        ],
        IsTruncated: false,
        MaxItems: '1'
      });
    });

    it('details the target expectedly', async () => {
      const [{ target }] = await collectRoute53RecordDetails(hostedZone);

      expect(target).toStrictEqual<RecordsTargetDetails>({
        records: ['192.168.1.1'],
        ttl: 300
      });
    });
  });

  describe('when a record has neither AliasTarget or TTL', () => {
    beforeEach(() =>
      listResourceRecordSetsMock.mockResolvedValue({
        ResourceRecordSets: [buildResourceRecordSet('my.zone.com.', 'A')],
        IsTruncated: false,
        MaxItems: '1'
      })
    );

    it('throws an error', async () => {
      await expect(collectRoute53RecordDetails(hostedZone)).rejects.toThrow(
        'TTL and AliasTarget cannot both be undefined'
      );
    });
  });

  describe('when the response is truncated', () => {
    beforeEach(() =>
      [
        'zone.com.', //
        'my.zone.com.',
        'www.zone.com.'
      ].forEach((name, i, arr) =>
        listResourceRecordSetsMock.mockResolvedValueOnce({
          ResourceRecordSets: [buildResourceRecordSet(name, 'A', { TTL: 300 })],
          MaxItems: '1',
          IsTruncated: !!(1 + i - arr.length),
          NextRecordIdentifier: 'identifier',
          NextRecordName: 'name',
          NextRecordType: 'type'
        })
      )
    );

    it('collects every record set', async () => {
      const recordDetails = await collectRoute53RecordDetails(hostedZone);

      expect(recordDetails).toHaveLength(3);
    });

    it('requests until IsTruncated is false', async () => {
      await collectRoute53RecordDetails(hostedZone);

      expect(listResourceRecordSetsMock).toHaveBeenCalledTimes(3);
    });

    it('uses the "NextRecord" properties', async () => {
      await collectRoute53RecordDetails(hostedZone);

      expect(listResourceRecordSetsMock).toHaveBeenCalledWith<
        [Route53.ListResourceRecordSetsRequest]
      >({
        HostedZoneId: hostedZone.id,
        StartRecordIdentifier: 'identifier',
        StartRecordName: 'name',
        StartRecordType: 'type'
      });
    });
  });
});
