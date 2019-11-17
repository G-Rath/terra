import {
  buildRoute53RecordResource,
  buildRoute53ZoneResource,
  Route53ZoneDetails
} from '@src/builders';
import {
  collectRoute53RecordDetails,
  collectRoute53ZoneDetails
} from '@src/collectors';
import { makeTFResourceBlock } from '@src/makers';
import { nadoRoute53Zone } from '@src/nados';
import { AwsResourceType } from '@src/utils';
import { mocked } from 'ts-jest/utils';

jest.mock('@src/collectors/aws/collectRoute53ZoneDetails');
jest.mock('@src/builders/aws/buildRoute53ZoneResource');

jest.mock('@src/collectors/aws/collectRoute53RecordDetails');
jest.mock('@src/builders/aws/buildRoute53RecordResource');

const collectRoute53ZoneDetailsMock = mocked(collectRoute53ZoneDetails);
const buildRoute53ZoneResourceMock = mocked(buildRoute53ZoneResource);

const collectRoute53RecordDetailsMock = mocked(collectRoute53RecordDetails);
const buildRoute53RecordResourceMock = mocked(buildRoute53RecordResource);

describe('nadoRoute53Zone', () => {
  const zoneDetails: Route53ZoneDetails = {
    id: 'HostedZone/Z123456789',
    name: 'my.zone.com.',
    comment: undefined,
    isPrivate: false
  };

  beforeEach(() => {
    collectRoute53ZoneDetailsMock.mockResolvedValue(zoneDetails);
    buildRoute53ZoneResourceMock.mockReturnValue(
      makeTFResourceBlock(
        'my_zone_com', //
        AwsResourceType.AWS_ROUTE53_ZONE,
        []
      )
    );
  });

  it('includes the Route53 Zone resource', async () => {
    const [block] = await nadoRoute53Zone('/HostedZone/123456789', false);

    expect(block).toStrictEqual(
      makeTFResourceBlock('my_zone_com', AwsResourceType.AWS_ROUTE53_ZONE, [])
    );
  });

  it('has the Route53 Zone resource as the first block', async () => {
    const [block] = await nadoRoute53Zone('/HostedZone/123456789', false);

    expect(block).toStrictEqual(
      makeTFResourceBlock('my_zone_com', AwsResourceType.AWS_ROUTE53_ZONE, [])
    );
  });

  it('only nados the zone', async () => {
    const tfRoot = await nadoRoute53Zone('/HostedZone/123456789', false);

    expect(tfRoot).toHaveLength(1);
  });

  describe('when greedy', () => {
    beforeEach(() => {
      collectRoute53RecordDetailsMock.mockResolvedValue([
        {
          name: 'my.zone.com',
          type: 'NS',
          target: {
            ttl: 300,
            records: []
          },
          zoneId: zoneDetails.id,
          zoneName: zoneDetails.name
        }
      ]);
      buildRoute53RecordResourceMock.mockReturnValue(
        makeTFResourceBlock(
          'my_record_com',
          AwsResourceType.AWS_ROUTE53_RECORD,
          []
        )
      );
    });

    it('has the Route53 Zone resource as the first block', async () => {
      const [block] = await nadoRoute53Zone('/HostedZone/123456789', false);

      expect(block).toStrictEqual(
        makeTFResourceBlock('my_zone_com', AwsResourceType.AWS_ROUTE53_ZONE, [])
      );
    });

    it('sweeps in the records for the zone', async () => {
      const [, block] = await nadoRoute53Zone('/HostedZone/123456789', true);

      expect(block).toStrictEqual(
        makeTFResourceBlock(
          'my_record_com',
          AwsResourceType.AWS_ROUTE53_RECORD,
          []
        )
      );
    });
  });
});
