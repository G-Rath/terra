import type { IAMUserDetails } from '@src/builders';
import { collectIAMUserDetails } from '@src/collectors';
import { mockAwsClientEndpoints } from '@test/setupAwsSdkMock';
import { IAM } from 'aws-sdk';

const {
  getUser: getUserMock,
  listUsers: listUsersMock
} = mockAwsClientEndpoints('IAM', {
  getUser: jest.fn<Promise<IAM.GetUserResponse>, [IAM.GetUserRequest]>(),
  listUsers: jest.fn<Promise<IAM.ListUsersResponse>, [IAM.ListUsersRequest]>()
});

describe('collectIAMUserDetails', () => {
  describe('when the userName param is absent', () => {
    const mockUsers: IAM.User[] = [...Array(3).keys()].map<IAM.User>(i => ({
      UserName: `name-${i}`,
      UserId: `id-${i}`,
      Arn: `arn-${i}`,
      Path: '/',
      PermissionsBoundary:
        i % 2 ? { PermissionsBoundaryArn: `pba-${i}` } : undefined,
      CreateDate: new Date()
    }));

    beforeEach(() =>
      listUsersMock.mockImplementation(async param => {
        const i = +(param.Marker ?? 0);
        const next = i + 1;

        return Promise.resolve({
          Users: [mockUsers[i]],
          Marker: mockUsers.length === next ? undefined : next.toString()
        });
      })
    );

    it('uses the list-users endpoint', async () => {
      await collectIAMUserDetails();

      expect(getUserMock).not.toHaveBeenCalled();
      expect(listUsersMock).toHaveBeenCalledTimes(3);
    });

    it('collects all the users', async () => {
      const users = await collectIAMUserDetails();

      expect(users).toHaveLength(3);
      expect(users).toMatchInlineSnapshot(`
        Array [
          Object {
            "name": "name-0",
            "path": "/",
            "permissionsBoundaryArn": undefined,
          },
          Object {
            "name": "name-1",
            "path": "/",
            "permissionsBoundaryArn": "pba-1",
          },
          Object {
            "name": "name-2",
            "path": "/",
            "permissionsBoundaryArn": undefined,
          },
        ]
      `);
    });
  });

  describe('when the userName param is present', () => {
    const user: IAM.User = {
      UserName: 'MyUser',
      UserId: 'MyId',
      Arn: 'MyArn',
      Path: '/',
      CreateDate: new Date()
    };

    beforeEach(() => getUserMock.mockResolvedValue({ User: user }));

    it('uses the get-user endpoint', async () => {
      await collectIAMUserDetails('my-user');

      expect(getUserMock).toHaveBeenCalledTimes(1);
      expect(listUsersMock).not.toHaveBeenCalled();
    });

    it('collects the user', async () => {
      expect(await collectIAMUserDetails('my-user')).toStrictEqual<
        [IAMUserDetails]
      >([
        {
          name: user.UserName,
          path: user.Path,
          permissionsBoundaryArn: undefined
        }
      ]);
    });

    describe('when the user has a permissions boundary', () => {
      it('collects the arn', async () => {
        const permissionsBoundaryArn = 'MyPermissionBoundaryArn';

        getUserMock.mockResolvedValue({
          User: {
            ...user,
            PermissionsBoundary: {
              PermissionsBoundaryArn: permissionsBoundaryArn,
              PermissionsBoundaryType: 'PermissionsBoundaryPolicy'
            }
          }
        });

        expect(await collectIAMUserDetails('my-user')).toStrictEqual<
          [IAMUserDetails]
        >([expect.objectContaining({ permissionsBoundaryArn })]);
      });
    });
  });
});
