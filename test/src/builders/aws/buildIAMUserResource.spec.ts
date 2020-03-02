import { TFIAMUserResource, buildIAMUserResource } from '@src/builders';
import { AwsResourceType } from '@src/utils';

describe('buildIAMUserResource', () => {
  it('builds an aws_iam_user resource', () => {
    const resource = buildIAMUserResource({ name: 'my-user' });

    expect(resource).toBeTFBlockWithLabel(AwsResourceType.AWS_IAM_USER, 0);
  });

  it('uses the user name to build the resource name', () => {
    const resource = buildIAMUserResource({ name: 'my-user' });

    expect(resource).toBeTFBlockWithLabel('my-user', 1);
  });

  it('sanitizes the resource name', () => {
    const resource = buildIAMUserResource({ name: '/iam+user=fun@times/' });

    expect(resource.labels[1]).toMatchInlineSnapshot(`
      Object {
        "surroundingText": Object {
          "leadingOuterText": "",
          "trailingOuterText": "",
        },
        "type": "Label",
        "value": "_slash_iam_plus_user_eq_fun_at_times_slash_",
      }
    `);
  });

  describe('when "path" is present', () => {
    it('is included as an argument', () => {
      const resource = buildIAMUserResource({
        name: 'my-user',
        path: '/clients'
      });

      expect(resource.body).toContainTFArgumentWithExpression(
        'path',
        '"/clients"'
      );
    });
  });

  describe('when "permissionsBoundaryArn" is present', () => {
    it('is included as an argument', () => {
      const resource = buildIAMUserResource({
        name: 'my-user',
        permissionsBoundaryArn: 'aws:iam::this-is-the-boundary'
      });

      expect(resource.body).toContainTFArgumentWithExpression<
        keyof TFIAMUserResource
      >('permissions_boundary', '"aws:iam::this-is-the-boundary"');
    });
  });

  describe('when "forceDestroy" is present', () => {
    it('is included as an argument', () => {
      const resource = buildIAMUserResource({
        name: 'my-user',
        forceDestroy: false
      });

      expect(resource.body).toContainTFArgumentWithExpression<
        keyof TFIAMUserResource
      >('force_destroy', 'false');
    });
  });
});
