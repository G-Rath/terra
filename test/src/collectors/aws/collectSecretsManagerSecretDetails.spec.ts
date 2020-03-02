import { collectSecretsManagerSecretDetails } from '@src/collectors';
import { mockAwsClientEndpoints } from '@test/setupAwsSdkMock';
import { SecretsManager } from 'aws-sdk';

const {
  describeSecret: describeSecretMock,
  listSecrets: listSecretsMock
} = mockAwsClientEndpoints('SecretsManager', {
  describeSecret: jest.fn<
    Promise<SecretsManager.DescribeSecretResponse>,
    [SecretsManager.DescribeSecretRequest]
  >(),
  listSecrets: jest.fn<
    Promise<SecretsManager.ListSecretsResponse>,
    [SecretsManager.ListSecretsRequest]
  >()
});

describe('collectSecretsManagerSecretDetails', () => {
  describe('when the secretId param is absent', () => {
    const mockSecrets: SecretsManager.SecretListEntry[] = [
      ...Array(3).keys()
    ].map<SecretsManager.SecretListEntry>(i => ({
      ARN: `arn-${i}`,
      Name: `secret-${i}`,
      Description: `Secret #${i}`
    }));

    beforeEach(() =>
      listSecretsMock.mockImplementation(async param => {
        const i = +(param.NextToken ?? 0);
        const next = i + 1;

        return Promise.resolve({
          SecretList: [mockSecrets[i]],
          NextToken: mockSecrets.length === next ? undefined : next.toString()
        });
      })
    );

    it('uses the list-secrets endpoint', async () => {
      await collectSecretsManagerSecretDetails();

      expect(describeSecretMock).not.toHaveBeenCalled();
      expect(listSecretsMock).toHaveBeenCalledTimes(3);
    });

    it('collects all the secrets', async () => {
      const secrets = await collectSecretsManagerSecretDetails();

      expect(secrets).toHaveLength(3);
      expect(secrets).toMatchInlineSnapshot(`
        Array [
          Object {
            "description": "Secret #0",
            "kmsKeyId": undefined,
            "name": "secret-0",
            "rotationLambdaARN": undefined,
            "rotationRules": undefined,
          },
          Object {
            "description": "Secret #1",
            "kmsKeyId": undefined,
            "name": "secret-1",
            "rotationLambdaARN": undefined,
            "rotationRules": undefined,
          },
          Object {
            "description": "Secret #2",
            "kmsKeyId": undefined,
            "name": "secret-2",
            "rotationLambdaARN": undefined,
            "rotationRules": undefined,
          },
        ]
      `);
    });

    describe('if SecretList is ever somehow undefined', () => {
      beforeEach(() => listSecretsMock.mockResolvedValue({}));

      it('throws and asks to be reported', async () => {
        await expect(collectSecretsManagerSecretDetails()).rejects.toThrow(
          '"SecretList" is somehow undefined - please report this!'
        );
      });
    });
  });

  describe('when the secretId param is present', () => {
    beforeEach(() =>
      describeSecretMock.mockResolvedValue({ Name: 'my-secret' })
    );

    it('uses the describe-secret endpoint', async () => {
      await collectSecretsManagerSecretDetails('my-secret');

      expect(describeSecretMock).toHaveBeenCalledTimes(1);
      expect(listSecretsMock).not.toHaveBeenCalled();
    });

    it('collects the name', async () => {
      const [{ name }] = await collectSecretsManagerSecretDetails('my-secret');

      expect(name).toStrictEqual('my-secret');
    });

    describe('when the secret has a description', () => {
      beforeEach(() =>
        describeSecretMock.mockResolvedValue({
          Name: 'my-secret',
          Description: 'hands off!'
        })
      );

      it('collects the description', async () => {
        const [{ description }] = await collectSecretsManagerSecretDetails(
          'my-secret'
        );

        expect(description).toStrictEqual('hands off!');
      });
    });

    describe('when the secret has a kms key id', () => {
      beforeEach(() =>
        describeSecretMock.mockResolvedValue({
          Name: 'my-secret',
          KmsKeyId: '123456789'
        })
      );

      it('collects the kms key id', async () => {
        const [{ kmsKeyId }] = await collectSecretsManagerSecretDetails(
          'my-secret'
        );

        expect(kmsKeyId).toStrictEqual('123456789');
      });
    });

    describe('when the secret has a rotation lambda arn', () => {
      beforeEach(() =>
        describeSecretMock.mockResolvedValue({
          Name: 'my-secret',
          RotationLambdaARN: 'aws:lambda:rotate-my-secret-please'
        })
      );

      it('collects the rotation lambda arn', async () => {
        const [
          { rotationLambdaARN }
        ] = await collectSecretsManagerSecretDetails('my-secret');

        expect(rotationLambdaARN).toStrictEqual(
          'aws:lambda:rotate-my-secret-please'
        );
      });
    });

    describe('when the secret has rotation rules', () => {
      beforeEach(() =>
        describeSecretMock.mockResolvedValue({
          Name: 'my-secret',
          RotationRules: { AutomaticallyAfterDays: 30 }
        })
      );

      it('collects the rotation rules', async () => {
        const [{ rotationRules }] = await collectSecretsManagerSecretDetails(
          'my-secret'
        );

        expect(rotationRules).toStrictEqual({ automaticallyAfterDays: 30 });
      });

      describe('if AutomaticallyAfterDays is ever somehow undefined', () => {
        beforeEach(() =>
          describeSecretMock.mockResolvedValue({
            Name: 'my-secret',
            RotationRules: {}
          })
        );

        it('throws and asks to be reported', async () => {
          await expect(
            collectSecretsManagerSecretDetails('my-secret')
          ).rejects.toThrow(
            '"AutomaticallyAfterDays" is somehow undefined - please report this!'
          );
        });
      });
    });

    describe('if Name is ever somehow undefined', () => {
      beforeEach(() => describeSecretMock.mockResolvedValue({}));

      it('throws and asks to be reported', async () => {
        await expect(
          collectSecretsManagerSecretDetails('my-secret')
        ).rejects.toThrow('"Name" is somehow undefined - please report this!');
      });
    });
  });
});
