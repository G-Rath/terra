import { buildRoute53RecordResource } from '@src/builders/aws';
import {
  AwsResourceType,
  makeTFArgument,
  makeTFStringArgument
} from '@src/utils';

describe('buildRoute53RecordResource', () => {
  it('builds an aws_route53_record resource', () => {
    const { resource } = buildRoute53RecordResource(
      {
        Type: 'NS',
        Name: 'imnotcrazy.info.'
      },
      '/hostedzone/ZGOHJFV44YG7Z',
      'imnotcrazy.info'
    );

    expect(resource).toBe(AwsResourceType.AWS_ROUTE53_RECORD);
  });

  describe('the resource name', () => {
    describe('when the "name" argument is an empty string', () => {
      it('omits it from the name', () => {
        const { name } = buildRoute53RecordResource(
          {
            Type: 'NS',
            Name: 'imnotcrazy.info.'
          },
          '/hostedzone/ZGOHJFV44YG7Z',
          'imnotcrazy.info'
        );

        expect(name).toBe('imnotcrazy_info_ns');
      });
    });

    it('names the resource as expected', () => {
      const { name } = buildRoute53RecordResource(
        {
          Type: 'A',
          Name: 'www.imnotcrazy.info.'
        },
        '/hostedzone/ZGOHJFV44YG7Z',
        'imnotcrazy.info'
      );

      expect(name).toBe('imnotcrazy_info_www_a');
    });
  });
  describe('the required arguments', () => {
    it('includes the "name" argument', () => {
      const { body } = buildRoute53RecordResource(
        {
          Type: 'NS',
          Name: 'imnotcrazy.info.'
        },
        '/hostedzone/ZGOHJFV44YG7Z',
        'imnotcrazy.info'
      );

      expect(body).toContainTFArgumentWithExpression('name', '""');
    });

    it('includes the "zone_id" argument', () => {
      const { body } = buildRoute53RecordResource(
        {
          Type: 'NS',
          Name: 'imnotcrazy.info.'
        },
        '/hostedzone/ZGOHJFV44YG7Z',
        'imnotcrazy.info'
      );

      expect(body).toContainTFArgumentWithExpression(
        'zone_id',
        '"/hostedzone/ZGOHJFV44YG7Z"'
      );
    });

    it('includes the "type" argument', () => {
      const { body } = buildRoute53RecordResource(
        {
          Type: 'NS',
          Name: 'imnotcrazy.info.'
        },
        '/hostedzone/ZGOHJFV44YG7Z',
        'imnotcrazy.info'
      );

      expect(body).toContainTFArgumentWithExpression('type', '"NS"');
    });
  });

  describe('when the record has an AliasTarget', () => {
    it('includes it as a block', () => {
      const { body } = buildRoute53RecordResource(
        {
          Type: 'NS',
          Name: 'imnotcrazy.info.',
          AliasTarget: {
            HostedZoneId: 'Z2FDTNDATAQYW2',
            DNSName: 'd1qgcauaj18ot9.cloudfront.net.',
            EvaluateTargetHealth: false
          }
        },
        '/hostedzone/ZGOHJFV44YG7Z',
        'imnotcrazy.info'
      );

      expect(body).toContainTFBlockLiteralWithBody('alias', [
        makeTFStringArgument('zone_id', 'Z2FDTNDATAQYW2'),
        makeTFStringArgument('name', 'd1qgcauaj18ot9.cloudfront.net.'),
        makeTFArgument('evaluate_target_health', false)
      ]);
    });

    it('omits the alias block', () => {
      const { body } = buildRoute53RecordResource(
        {
          Type: 'NS',
          Name: 'imnotcrazy.info.',
          TTL: 300
        },
        '/hostedzone/ZGOHJFV44YG7Z',
        'imnotcrazy.info'
      );

      expect(body).not.toContainTFBlockLiteral('alias');
    });
  });

  describe('when the record has a TTL', () => {
    it('includes it as an argument', () => {
      const { body } = buildRoute53RecordResource(
        {
          Type: 'NS',
          Name: 'imnotcrazy.info.',
          TTL: 300,
          ResourceRecords: [{ Value: '192.168.1.42' }]
        },
        '/hostedzone/ZGOHJFV44YG7Z',
        'imnotcrazy.info'
      );

      expect(body).toContainTFArgumentWithExpression('ttl', 300);
    });

    it('includes the records argument', () => {
      const { body } = buildRoute53RecordResource(
        {
          Type: 'NS',
          Name: 'imnotcrazy.info.',
          TTL: 300,
          ResourceRecords: [{ Value: '192.168.1.42' }]
        },
        '/hostedzone/ZGOHJFV44YG7Z',
        'imnotcrazy.info'
      );

      expect(body).toContainTFArgumentWithExpression('records', [
        '"192.168.1.42"'
      ]);
    });

    it('omits the alias block', () => {
      const { body } = buildRoute53RecordResource(
        {
          Type: 'NS',
          Name: 'imnotcrazy.info.',
          TTL: 300
        },
        '/hostedzone/ZGOHJFV44YG7Z',
        'imnotcrazy.info'
      );

      expect(body).not.toContainTFBlockLiteral('alias');
    });
  });
});
