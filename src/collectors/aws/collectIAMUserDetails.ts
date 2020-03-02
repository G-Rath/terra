import { IAMUserDetails } from '@src/builders';
import { collectAllFromPaginatedAwsEndpoint } from '@src/utils';
import { IAM } from 'aws-sdk';

/**
 * Collects the details required to build a representation of an IAM User in Terraform.
 *
 * If a `userName` is provided, just that user will be collected;
 * Otherwise, all users returned by the `list-users` endpoint will be collected.
 *
 * @param {string} [userName]
 *
 * @return {Promise<IAMUserDetails[]>}
 */
export const collectIAMUserDetails = async (
  userName?: string
): Promise<IAMUserDetails[]> => {
  const iam = new IAM();

  if (userName) {
    const { User: user } = await iam.getUser({ UserName: userName }).promise();

    return [
      {
        name: user.UserName,
        path: user.Path,
        permissionsBoundaryArn: user.PermissionsBoundary?.PermissionsBoundaryArn
      }
    ];
  }

  return collectAllFromPaginatedAwsEndpoint(
    iam.listUsers.bind(iam),
    'Marker',
    previous => (previous ? { Marker: previous.Marker } : {}),
    response =>
      response.Users.map(
        (user): IAMUserDetails => ({
          name: user.UserName,
          path: user.Path,
          permissionsBoundaryArn: user.PermissionsBoundary
            ? user.PermissionsBoundary.PermissionsBoundaryArn
            : undefined
        })
      )
  );
};
