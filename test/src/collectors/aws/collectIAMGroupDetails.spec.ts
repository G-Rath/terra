import { IAMGroupDetails } from '@src/builders';
import { collectIAMGroupDetails } from '@src/collectors';
import { mockAwsClientEndpoints } from '@test/setupAwsSdkMock';
import { IAM } from 'aws-sdk';

const {
  getGroup: getGroupMock,
  listGroups: listGroupsMock
} = mockAwsClientEndpoints('IAM', {
  getGroup: jest.fn<Promise<IAM.GetGroupResponse>, [IAM.GetGroupRequest]>(),
  listGroups: jest.fn<
    Promise<IAM.ListGroupsResponse>,
    [IAM.ListGroupsRequest]
  >()
});

describe('collectIAMGroupDetails', () => {
  describe('when the groupName param is absent', () => {
    const mockGroups: IAM.Group[] = [...Array(3).keys()].map<IAM.Group>(i => ({
      GroupName: `name-${i}`,
      GroupId: `id-${i}`,
      Arn: `arn-${i}`,
      Path: '/',
      CreateDate: new Date()
    }));

    beforeEach(() =>
      listGroupsMock.mockImplementation(async param => {
        const i = +(param.Marker ?? 0);
        const next = i + 1;

        return Promise.resolve({
          Groups: [mockGroups[i]],
          Marker: mockGroups.length === next ? undefined : next.toString()
        });
      })
    );

    it('uses the list-groups endpoint', async () => {
      await collectIAMGroupDetails();

      expect(getGroupMock).not.toHaveBeenCalled();
      expect(listGroupsMock).toHaveBeenCalledTimes(3);
    });

    it('collects all the groups', async () => {
      const groups = await collectIAMGroupDetails();

      expect(groups).toHaveLength(3);
      expect(groups).toMatchInlineSnapshot(`
        Array [
          Object {
            "name": "name-0",
            "path": "/",
          },
          Object {
            "name": "name-1",
            "path": "/",
          },
          Object {
            "name": "name-2",
            "path": "/",
          },
        ]
      `);
    });
  });

  describe('when the groupName param is present', () => {
    const group: IAM.Group = {
      GroupName: 'MyGroup',
      GroupId: 'MyId',
      Arn: 'MyArn',
      Path: '/',
      CreateDate: new Date()
    };

    beforeEach(() =>
      getGroupMock.mockResolvedValue({ Group: group, Users: [] })
    );

    it('uses the get-group endpoint', async () => {
      await collectIAMGroupDetails('my-group');

      expect(getGroupMock).toHaveBeenCalledTimes(1);
      expect(listGroupsMock).not.toHaveBeenCalled();
    });

    it('collects the group', async () => {
      expect(await collectIAMGroupDetails('my-group')).toStrictEqual<
        [IAMGroupDetails]
      >([{ name: group.GroupName, path: group.Path }]);
    });
  });
});
