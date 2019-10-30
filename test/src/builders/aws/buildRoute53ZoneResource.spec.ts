import { buildRoute53ZoneResource } from '@src/builders/aws';
import { TFArgument, TFNodeType, TFResourceBlock } from '@src/types';
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
    const expectedArgument: TFArgument<'name'> = {
      type: TFNodeType.Argument,
      identifier: 'name',
      expression: '"imnotcrazy.info"'
    };

    const { body } = buildRoute53ZoneResource({
      Id: '/hostedzone/ZGOHJFV44YG7Z',
      Name: 'imnotcrazy.info.',
      CallerReference: 'nonce'
    });

    expect(body).toContainEqual(expectedArgument);
  });

  it('includes only the name in the body', () => {
    const expectedAST: TFResourceBlock = {
      type: TFNodeType.Resource,
      resource: AwsResourceType.AWS_ROUTE53_ZONE,
      name: 'imnotcrazy_info',
      body: [
        {
          type: TFNodeType.Argument,
          identifier: 'name',
          expression: '"imnotcrazy.info"'
        }
      ]
    };

    expect(
      buildRoute53ZoneResource({
        Id: '/hostedzone/ZGOHJFV44YG7Z',
        Name: 'imnotcrazy.info',
        CallerReference: 'nonce'
      })
    ).toStrictEqual(expectedAST);
  });

  describe('when hostedZone includes Config', () => {
    describe('when Comment is set', () => {
      it('is mapped to the "comment" argument', () => {
        const comment = 'This is my zone!';
        const expectedArgument: TFArgument<'comment'> = {
          type: TFNodeType.Argument,
          identifier: 'comment',
          expression: `"${comment}"`
        };

        const { body } = buildRoute53ZoneResource({
          Id: '/hostedzone/ZGOHJFV44YG7Z',
          Name: 'imnotcrazy.info.',
          CallerReference: 'nonce',
          Config: { Comment: comment }
        });

        expect(body).toContainEqual(expectedArgument);
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

        expect(body).not.toContainEqual(
          expect.objectContaining({
            type: TFNodeType.Argument,
            identifier: 'comment'
          })
        );
      });
    });
  });
});
