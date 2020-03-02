import * as collectors from '@src/collectors';
import { AwsSecretsManagerSecret } from '@src/commands';

describe('aws_secretsmanager_secret', () => {
  let logSpy: jest.SpiedFunction<typeof AwsSecretsManagerSecret.prototype.log>;
  let collectSecretsManagerSecretDetailsSpy: jest.SpiedFunction<typeof collectors.collectSecretsManagerSecretDetails>;

  beforeEach(() => {
    logSpy = jest.spyOn(AwsSecretsManagerSecret.prototype, 'log');
    collectSecretsManagerSecretDetailsSpy = jest
      .spyOn(collectors, 'collectSecretsManagerSecretDetails')
      .mockResolvedValue([]);
  });

  it('supports the three base flags', async () => {
    expect(
      await AwsSecretsManagerSecret.run(['-F', '-w', '-f', 'myfile'])
    ).toBeUndefined();
  });

  describe('when called without an argument', () => {
    it('logs what is about to happen', async () => {
      await AwsSecretsManagerSecret.run([]);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Preparing to generate Terraform configuration for Secrets'
        )
      );
    });

    it('passes undefined to the collector', async () => {
      await AwsSecretsManagerSecret.run([]);

      expect(collectSecretsManagerSecretDetailsSpy).toHaveBeenCalledWith(
        undefined
      );
    });
  });

  describe('when called with an argument', () => {
    it('logs what is about to happen', async () => {
      await AwsSecretsManagerSecret.run(['my-secret']);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Preparing to generate Terraform configuration for Secret my-secret'
        )
      );
    });

    it('passes the argument to the collector', async () => {
      await AwsSecretsManagerSecret.run(['my-secret']);

      expect(collectSecretsManagerSecretDetailsSpy).toHaveBeenCalledWith(
        'my-secret'
      );
    });
  });
});
