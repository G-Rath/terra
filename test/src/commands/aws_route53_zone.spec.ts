import { AwsRoute53Zone } from '@src/commands';
import { makeTFResourceBlock } from '@src/makers';
import { nadoRoute53Zone } from '@src/nados';
import { AwsResourceType } from '@src/utils';
import dedent from 'dedent';
import { mocked } from 'ts-jest/utils';

jest.mock('@src/nados/aws/nadoRoute53Zone');

const nadoRoute53ZoneMock = mocked(nadoRoute53Zone);

describe('aws_route53_zone', () => {
  const zoneId = '/HostedZone/123456789';

  let consoleLogSpy: jest.SpiedFunction<typeof console.log>;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log');
    nadoRoute53ZoneMock.mockResolvedValue([
      makeTFResourceBlock(AwsResourceType.AWS_ROUTE53_ZONE, 'my_zone_com', [])
    ]);
  });

  it('should require the zoneId', async () => {
    await expect(AwsRoute53Zone.run([])).rejects.toThrow(dedent`
      Missing 1 required arg:
      zoneId
      See more help with --help
    `);
  });

  it('should pass the zoneId to nadoRoute53Zone', async () => {
    await AwsRoute53Zone.run([zoneId]);

    expect(nadoRoute53ZoneMock).toHaveBeenCalledWith(
      zoneId,
      expect.any(Boolean)
    );
  });

  describe('the --greedy flag', () => {
    it('calls nadoRoute53Zone with greed', async () => {
      await AwsRoute53Zone.run(['--greedy', zoneId]);

      expect(nadoRoute53ZoneMock).toHaveBeenCalledWith(zoneId, true);
    });

    it('should map -g to --greedy', async () => {
      await AwsRoute53Zone.run(['-g', zoneId]);

      expect(nadoRoute53ZoneMock).toHaveBeenCalledWith(zoneId, true);
    });

    describe('when omitted', () => {
      it('defaults to "false"', async () => {
        await AwsRoute53Zone.run([zoneId]);

        expect(nadoRoute53ZoneMock).toHaveBeenCalledWith(zoneId, false);
      });
    });
  });

  describe('the output', () => {
    it('prints the file name', async () => {
      await AwsRoute53Zone.run([zoneId]);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('route_my_zone_com')
      );
    });
  });
});
