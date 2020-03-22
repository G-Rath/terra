import { makeTFResourceBlock, makeTFStringArgument } from '@src/makers';
import type { TFBlockBodyBody, TFResourceBlock } from '@src/types';
import { AwsResourceType, asResourceName } from '@src/utils';

export interface TFSecretsManagerSecretResource {
  name?: string;
  name_prefix?: string;
  description?: string;
  kms_key_id?: string;
  policy?: string;
  recovery_window_in_days?: number;
  rotation_lambda_arn?: string;
  rotation_rules?: { automatically_after_days: number };
  tags?: string;
}

export interface SecretRotationRules {
  automaticallyAfterDays: number;
}

export interface SecretsManagerSecretDetails {
  name: string;
  description?: string;
  kmsKeyId?: string;
  rotationRules?: SecretRotationRules;
  rotationLambdaARN?: string;
}

/**
 * Builds a Secrets Manager Secret Terraform resource.
 *
 * @param {SecretsManagerSecretDetails} details
 *
 * @return {TFResourceBlock}
 */
export const buildSecretsManagerSecretResource = (
  details: SecretsManagerSecretDetails
): TFResourceBlock => {
  const body: TFBlockBodyBody<keyof TFSecretsManagerSecretResource> = [];

  body.push(makeTFStringArgument('name', details.name));

  if (details.description) {
    body.push(makeTFStringArgument('description', details.description));
  }

  return makeTFResourceBlock(
    AwsResourceType.AWS_SECRETSMANAGER_SECRET,
    asResourceName(details.name),
    body
  );
};
