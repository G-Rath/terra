import {
  buildRoute53RecordResource,
  TFRoute53RecordAlias
} from '@src/builders/aws';
import { TFArgument, TFBlockLiteral, TFNodeType } from '@src/types';
import { AwsResourceType } from '@src/utils';

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
      const expectedArgument: TFArgument<'name'> = {
        type: TFNodeType.Argument,
        identifier: 'name',
        expression: '""'
      };

      const { body } = buildRoute53RecordResource(
        {
          Type: 'NS',
          Name: 'imnotcrazy.info.'
        },
        '/hostedzone/ZGOHJFV44YG7Z',
        'imnotcrazy.info'
      );

      expect(body).toContainEqual(expectedArgument);
    });

    it('includes the "zone_id" argument', () => {
      const expectedArgument: TFArgument<'zone_id'> = {
        type: TFNodeType.Argument,
        identifier: 'zone_id',
        expression: '"/hostedzone/ZGOHJFV44YG7Z"'
      };

      const { body } = buildRoute53RecordResource(
        {
          Type: 'NS',
          Name: 'imnotcrazy.info.'
        },
        '/hostedzone/ZGOHJFV44YG7Z',
        'imnotcrazy.info'
      );

      expect(body).toContainEqual(expectedArgument);
    });

    it('includes the "type" argument', () => {
      const expectedArgument: TFArgument<'type'> = {
        type: TFNodeType.Argument,
        identifier: 'type',
        expression: '"NS"'
      };

      // expect().toContainArgumentUnique();

      const { body } = buildRoute53RecordResource(
        {
          Type: 'NS',
          Name: 'imnotcrazy.info.'
        },
        '/hostedzone/ZGOHJFV44YG7Z',
        'imnotcrazy.info'
      );

      expect(body).toContainEqual(expectedArgument);
    });
  });

  describe('when the record has an AliasTarget', () => {
    it('includes it as a block', () => {
      const expectedBlock: TFBlockLiteral<keyof TFRoute53RecordAlias> = {
        type: TFNodeType.Block,
        name: 'alias',
        body: [
          {
            type: TFNodeType.Argument,
            identifier: 'zone_id',
            expression: '"Z2FDTNDATAQYW2"'
          },
          {
            type: TFNodeType.Argument,
            identifier: 'name',
            expression: '"d1qgcauaj18ot9.cloudfront.net."'
          },
          {
            type: TFNodeType.Argument,
            identifier: 'evaluate_target_health',
            expression: false
          }
        ]
      };

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

      expect(body).toContainEqual(expectedBlock);
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

      expect(body).not.toContainEqual(
        expect.objectContaining({
          type: TFNodeType.Block,
          name: 'alias'
        })
      );
    });
  });

  describe('when the record has a TTL', () => {
    it('includes it as an argument', () => {
      const expectedArgument: TFArgument<'ttl'> = {
        type: TFNodeType.Argument,
        identifier: 'ttl',
        expression: 300
      };

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

      expect(body).toContainEqual(expectedArgument);
    });

    it('includes the records argument', () => {
      const expectedArgument: TFArgument<'records'> = {
        type: TFNodeType.Argument,
        identifier: 'records',
        expression: ['"192.168.1.42"']
      };

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

      expect(body).toContainEqual(expectedArgument);
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

      expect(body).not.toContainEqual(
        expect.objectContaining({
          type: TFNodeType.Block,
          name: 'alias'
        })
      );
    });
  });
});
