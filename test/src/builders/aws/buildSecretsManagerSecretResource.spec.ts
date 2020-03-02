import { buildSecretsManagerSecretResource } from '@src/builders';
import { AwsResourceType } from '@src/utils';

describe('buildSecretsManagerSecretResource', () => {
  it('builds an aws_secretsmanager_secret resource', () => {
    const resource = buildSecretsManagerSecretResource({
      name: 'my_secret'
    });

    expect(resource).toBeTFBlockWithLabel(
      AwsResourceType.AWS_SECRETSMANAGER_SECRET,
      0
    );
  });

  it('uses the secret name to build the resource name', () => {
    const resource = buildSecretsManagerSecretResource({
      name: 'my-secret'
    });

    expect(resource).toBeTFBlockWithLabel('my-secret', 1);
  });

  it('sanitizes the resource name', () => {
    const resource = buildSecretsManagerSecretResource({
      name: '/secret+value=fun@times/'
    });

    expect(resource.labels[0]).toMatchInlineSnapshot(`
      Object {
        "surroundingText": Object {
          "leadingOuterText": "",
          "trailingOuterText": "",
        },
        "type": "Label",
        "value": "aws_secretsmanager_secret",
      }
    `);
  });

  describe('when the "description" is present', () => {
    it('includes it in the body', () => {
      const description = 'This is my secret';
      const resource = buildSecretsManagerSecretResource({
        name: 'my-secret',
        description
      });

      expect(resource.body).toContainTFArgumentWithExpression(
        'description',
        `"${description}"`
      );
    });
  });
});
