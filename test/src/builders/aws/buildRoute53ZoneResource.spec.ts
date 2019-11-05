import { buildRoute53ZoneResource } from '@src/builders/aws';
import { AwsResourceType } from '@src/utils';

describe('buildRoute53ZoneResource', () => {
  it('builds an aws_route53_zone resource', () => {
    const { resource } = buildRoute53ZoneResource({
      Id: '/hostedzone/ZGOHJFV44YG7Z',
      Name: 'imnotcrazy.info',
      CallerReference: 'nonce'
    });

    expect(resource).toBe(AwsResourceType.AWS_ROUTE53_ZONE);
  });

  it('uses "Name" to build the resource name', () => {
    const { name } = buildRoute53ZoneResource({
      Id: '/hostedzone/ZGOHJFV44YG7Z',
      Name: 'imnotcrazy.info',
      CallerReference: 'nonce'
    });

    expect(name).toBe('imnotcrazy_info');
  });

  it('normalizes the "name" argument', () => {
    const { body } = buildRoute53ZoneResource({
      Id: '/hostedzone/ZGOHJFV44YG7Z',
      Name: 'imnotcrazy.info.',
      CallerReference: 'nonce'
    });

    expect(body).toContainTFArgumentWithExpression('name', '"imnotcrazy.info"');
  });

  it('includes only the name in the body', () => {
    const { body } = buildRoute53ZoneResource({
      Id: '/hostedzone/ZGOHJFV44YG7Z',
      Name: 'imnotcrazy.info',
      CallerReference: 'nonce'
    });

    expect(body).toContainTFArgumentWithExpression('name', '"imnotcrazy.info"');
  });

  describe('when hostedZone includes Config', () => {
    describe('when Comment is set', () => {
      it('is mapped to the "comment" argument', () => {
        const comment = 'This is my zone!';

        const { body } = buildRoute53ZoneResource({
          Id: '/hostedzone/ZGOHJFV44YG7Z',
          Name: 'imnotcrazy.info.',
          CallerReference: 'nonce',
          Config: { Comment: comment }
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
          Id: '/hostedzone/ZGOHJFV44YG7Z',
          Name: 'imnotcrazy.info.',
          CallerReference: 'nonce',
          Config: { Comment: '' }
        });

        expect(body).not.toContainTFArgument('comment');
      });
    });
  });
});
