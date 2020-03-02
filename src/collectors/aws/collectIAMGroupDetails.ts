import { IAMGroupDetails } from '@src/builders';
import { collectAllFromPaginatedAwsEndpoint } from '@src/utils';
import { IAM } from 'aws-sdk';

/**
 * Collects the details required to build a representation of an IAM Group in Terraform.
 *
 * If a `groupName` is provided, just that group will be collected;
 * Otherwise, all groups returned by the `list-groups` endpoint will be collected.
 *
 * @param {string} [groupName]
 *
 * @return {Promise<IAMGroupDetails[]>}
 */
export const collectIAMGroupDetails = async (
  groupName?: string
): Promise<IAMGroupDetails[]> => {
  const iam = new IAM();

  if (groupName) {
    const { Group: group } = await iam
      .getGroup({ GroupName: groupName })
      .promise();

    return [{ name: group.GroupName, path: group.Path }];
  }

  return collectAllFromPaginatedAwsEndpoint(
    iam.listGroups.bind(iam),
    'Marker',
    previous => (previous ? { Marker: previous.Marker } : {}),
    response =>
      response.Groups.map(
        (group): IAMGroupDetails => ({
          name: group.GroupName,
          path: group.Path
        })
      )
  );
};
