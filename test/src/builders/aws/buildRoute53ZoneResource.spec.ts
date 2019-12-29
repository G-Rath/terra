import { buildRoute53ZoneResource } from '@src/builders';
import { AwsResourceType } from '@src/utils';

describe('buildRoute53ZoneResource', () => {
  it('builds an aws_route53_zone resource', () => {
    const resource = buildRoute53ZoneResource({
      id: '/HostedZone/123456789',
      name: 'imnotcrazy.info',
      isPrivate: false
    });

    expect(resource).toBeTFBlockWithLabel(AwsResourceType.AWS_ROUTE53_ZONE, 0);
  });

  it('uses "name" to build the resource name', () => {
    const resource = buildRoute53ZoneResource({
      id: '/HostedZone/123456789',
      name: 'imnotcrazy.info',
      isPrivate: false
    });

    expect(resource).toBeTFBlockWithLabel('imnotcrazy_info', 1);
  });

  it('normalizes the "name" argument', () => {
    const { body } = buildRoute53ZoneResource({
      id: '/HostedZone/123456789',
      name: 'imnotcrazy.info.',
      isPrivate: false
    });

    expect(body).toContainTFArgumentWithExpression('name', '"imnotcrazy.info"');
  });

  it('includes only the name in the body', () => {
    const { body } = buildRoute53ZoneResource({
      id: '/HostedZone/123456789',
      name: 'imnotcrazy.info',
      isPrivate: false
    });

    expect(body).toContainTFArgumentWithExpression('name', '"imnotcrazy.info"');
  });

  describe('when hostedZone includes Config', () => {
    describe('when Comment is set', () => {
      it('is mapped to the "comment" argument', () => {
        const comment = 'This is my zone!';

        const { body } = buildRoute53ZoneResource({
          id: '/HostedZone/123456789',
          name: 'imnotcrazy.info.',
          isPrivate: false,
          comment
        });

        expect(body).toContainTFArgumentWithExpression(
          'comment',
          `"${comment}"`
        );
      });
    });

    describe('when Comment is empty', () => {
      it('omits the "comment" argument', () => {
        const { body } = buildRoute53ZoneResource({
          id: '/HostedZone/123456789',
          name: 'imnotcrazy.info.',
          isPrivate: false,
          comment: ''
        });

        expect(body).not.toContainTFArgument('comment');
      });
    });
  });
});
