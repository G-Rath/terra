import { SecretsManagerSecretDetails } from '@src/builders';
import { assertDefined, collectAllFromPaginatedAwsEndpoint } from '@src/utils';
import { SecretsManager } from 'aws-sdk';

const detailSecretRotationRules = (
  rotationRules: SecretsManager.RotationRulesType
): Required<SecretsManagerSecretDetails>['rotationRules'] => {
  assertDefined(
    rotationRules.AutomaticallyAfterDays,
    '"AutomaticallyAfterDays" is somehow undefined - please report this!'
  );

  return { automaticallyAfterDays: rotationRules.AutomaticallyAfterDays };
};

const detailSecret = (
  secret: SecretsManager.SecretListEntry
): SecretsManagerSecretDetails => {
  assertDefined(
    secret.Name,
    '"Name" is somehow undefined - please report this!'
  );

  const rotationRules = secret.RotationRules
    ? detailSecretRotationRules(secret.RotationRules)
    : undefined;

  return {
    name: secret.Name,
    kmsKeyId: secret.KmsKeyId,
    description: secret.Description,
    rotationLambdaARN: secret.RotationLambdaARN,
    rotationRules
  };
};

/**
 * Collects the details required to build a representation
 * of Secrets Manager Secrets in Terraform.
 *
 * If a `secretId` is provided, then only the corresponding secret will be collected;
 * Otherwise, all secrets returned by the `list-secrets` endpoint will be collected.
 */
export const collectSecretsManagerSecretDetails = async (
  secretId?: string
): Promise<SecretsManagerSecretDetails[]> => {
  const secretsManager = new SecretsManager();

  if (secretId) {
    const secret = await secretsManager
      .describeSecret({ SecretId: secretId })
      .promise();

    return [detailSecret(secret)];
  }

  return collectAllFromPaginatedAwsEndpoint(
    secretsManager.listSecrets.bind(secretsManager),
    'NextToken',
    previous => (previous ? { NextToken: previous.NextToken } : {}),
    response => {
      assertDefined(
        response.SecretList,
        '"SecretList" is somehow undefined - please report this!'
      );

      return response.SecretList.map(detailSecret);
    }
  );
};
