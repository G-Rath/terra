import { buildRoute53RecordResource } from '@src/builders/aws';
import { makeTFArgument, makeTFStringArgument } from '@src/makers';
import { AwsResourceType } from '@src/utils';

describe('buildRoute53RecordResource', () => {
  it('builds an aws_route53_record resource', () => {
    const resource = buildRoute53RecordResource({
      name: 'imnotcrazy.info.',
      type: 'NS',
      target: {
        ttl: 300,
        records: []
      },
      zoneId: '/hostedzone/ZGOHJFV44YG7Z',
      zoneName: 'imnotcrazy.info'
    });

    expect(resource).toBeTFBlockWithLabel(
      AwsResourceType.AWS_ROUTE53_RECORD,
      0
    );
  });

  describe('the resource name', () => {
    describe('when the "name" argument is an empty string', () => {
      it('omits it from the name', () => {
        const resource = buildRoute53RecordResource({
          name: 'imnotcrazy.info.',
          type: 'NS',
          target: {
            ttl: 300,
            records: []
          },
          zoneId: '/hostedzone/ZGOHJFV44YG7Z',
          zoneName: 'imnotcrazy.info'
        });

        expect(resource).toBeTFBlockWithLabel('imnotcrazy_info_ns', 1);
      });
    });

    it('names the resource as expected', () => {
      const resource = buildRoute53RecordResource({
        name: 'www.imnotcrazy.info.',
        type: 'A',
        target: {
          ttl: 300,
          records: []
        },
        zoneId: '/hostedzone/ZGOHJFV44YG7Z',
        zoneName: 'imnotcrazy.info'
      });

      expect(resource).toBeTFBlockWithLabel('imnotcrazy_info_www_a', 1);
    });
  });

  describe('the required arguments', () => {
    it('includes the "name" argument', () => {
      const { body } = buildRoute53RecordResource({
        name: 'imnotcrazy.info.',
        type: 'NS',
        target: {
          ttl: 300,
          records: []
        },
        zoneId: '/hostedzone/ZGOHJFV44YG7Z',
        zoneName: 'imnotcrazy.info'
      });

      expect(body).toContainTFArgumentWithExpression('name', '""');
    });

    it('includes the "zone_id" argument', () => {
      const { body } = buildRoute53RecordResource({
        name: 'imnotcrazy.info.',
        type: 'NS',
        target: {
          ttl: 300,
          records: []
        },
        zoneId: '/hostedzone/ZGOHJFV44YG7Z',
        zoneName: 'imnotcrazy.info'
      });

      expect(body).toContainTFArgumentWithExpression(
        'zone_id',
        '"/hostedzone/ZGOHJFV44YG7Z"'
      );
    });

    it('includes the "type" argument', () => {
      const { body } = buildRoute53RecordResource({
        name: 'imnotcrazy.info.',
        type: 'NS',
        target: {
          ttl: 300,
          records: []
        },
        zoneId: '/hostedzone/ZGOHJFV44YG7Z',
        zoneName: 'imnotcrazy.info'
      });

      expect(body).toContainTFArgumentWithExpression('type', '"NS"');
    });
  });

  describe('when the record has an AliasTarget', () => {
    it('includes it as a block', () => {
      const { body } = buildRoute53RecordResource({
        name: 'imnotcrazy.info.',
        type: 'NS',
        target: {
          dnsName: 'd1qgcauaj18ot9.cloudfront.net.',
          hostedZoneId: 'Z2FDTNDATAQYW2',
          evaluateTargetHealth: false
        },
        zoneId: '/hostedzone/ZGOHJFV44YG7Z',
        zoneName: 'imnotcrazy.info'
      });

      expect(body).toContainTFBlockWithBody('alias', [
        makeTFStringArgument('zone_id', 'Z2FDTNDATAQYW2'),
        makeTFStringArgument('name', 'd1qgcauaj18ot9.cloudfront.net.'),
        makeTFArgument('evaluate_target_health', 'false')
      ]);
    });

    it('omits the alias block', () => {
      const { body } = buildRoute53RecordResource({
        name: 'imnotcrazy.info.',
        type: 'NS',
        target: {
          records: [],
          ttl: 300
        },
        zoneId: '/hostedzone/ZGOHJFV44YG7Z',
        zoneName: 'imnotcrazy.info'
      });

      expect(body).not.toContainTFBlock('alias');
    });
  });

  describe('when the record has a TTL', () => {
    it('includes it as an argument', () => {
      const { body } = buildRoute53RecordResource({
        name: 'imnotcrazy.info.',
        type: 'NS',
        target: {
          records: ['192.168.1.42'],
          ttl: 300
        },
        zoneId: '/hostedzone/ZGOHJFV44YG7Z',
        zoneName: 'imnotcrazy.info'
      });

      expect(body).toContainTFArgumentWithExpression('ttl', '300');
    });

    it('includes the records argument', () => {
      const { body } = buildRoute53RecordResource({
        name: 'imnotcrazy.info.',
        type: 'NS',
        target: {
          records: ['192.168.1.42'],
          ttl: 300
        },
        zoneId: '/hostedzone/ZGOHJFV44YG7Z',
        zoneName: 'imnotcrazy.info'
      });

      expect(body).toContainTFArgumentWithExpression('records', [
        '"192.168.1.42"'
      ]);
    });

    it('omits the alias block', () => {
      const { body } = buildRoute53RecordResource({
        name: 'imnotcrazy.info.',
        type: 'NS',
        target: {
          records: [],
          ttl: 300
        },
        zoneId: '/hostedzone/ZGOHJFV44YG7Z',
        zoneName: 'imnotcrazy.info'
      });

      expect(body).not.toContainTFBlock('alias');
    });

    describe('when the type is TXT', () => {
      it('escapes the record quotes', () => {
        const { body } = buildRoute53RecordResource({
          name: 'imnotcrazy.info.',
          type: 'TXT',
          target: {
            records: ['"v=spf1 -all"'],
            ttl: 300
          },
          zoneId: '/hostedzone/ZGOHJFV44YG7Z',
          zoneName: 'imnotcrazy.info'
        });

        expect(body).toContainTFArgumentWithExpression('records', [
          '"\\"v=spf1 -all\\""'
        ]);
      });
    });
  });
});
