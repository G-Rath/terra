import { Route53ZoneDetails } from '@src/builders';
import { collectRoute53ZoneDetails } from '@src/collectors/aws';
import { mockAwsClientEndpoints } from '@test/setupAwsSdkMock';
import { Route53 } from 'aws-sdk';

const {
  getHostedZone: getHostedZoneMock //
} = mockAwsClientEndpoints('Route53', {
  getHostedZone: jest.fn<Promise<Route53.GetHostedZoneResponse>, unknown[]>()
});

describe('collectRoute53ZoneDetails', () => {
  const HostedZone: Route53.HostedZone = {
    Id: 'HostedZone/Z123456789',
    Name: 'my.zone.com.',
    CallerReference: 'reference'
  };

  beforeEach(() => getHostedZoneMock.mockResolvedValue({ HostedZone }));

  it('includes the id returned by aws', async () => {
    const { id } = await collectRoute53ZoneDetails('my-zone');

    expect(id).toBe('HostedZone/Z123456789');
  });

  it('uses the unnormalized hosted zones Name', async () => {
    const { name } = await collectRoute53ZoneDetails('my-zone');

    expect(name).toBe('my.zone.com.');
  });

  describe('when the HostedZone has a comment', () => {
    beforeEach(() =>
      getHostedZoneMock.mockResolvedValue({
        HostedZone: {
          ...HostedZone,
          Config: { Comment: 'This is my zone!' }
        }
      })
    );

    it('is included in the details', async () => {
      const { comment } = await collectRoute53ZoneDetails('my-zone');

      expect(comment).toBe('This is my zone!');
    });
  });

  describe('when the HostedZone is private', () => {
    beforeEach(() =>
      getHostedZoneMock.mockResolvedValue({
        HostedZone: {
          ...HostedZone,
          Config: { PrivateZone: true }
        }
      })
    );

    it('is included in the details', async () => {
      const { isPrivate } = await collectRoute53ZoneDetails('my-zone');

      expect(isPrivate).toBe(true);
    });
  });

  describe('when Config is omitted from the HostedZone', () => {
    it('uses sensible defaults', async () => {
      const details = await collectRoute53ZoneDetails('my-zone');

      expect(details).toStrictEqual<Route53ZoneDetails>({
        id: 'HostedZone/Z123456789',
        name: 'my.zone.com.',
        comment: undefined,
        isPrivate: false
      });
    });
  });
});
