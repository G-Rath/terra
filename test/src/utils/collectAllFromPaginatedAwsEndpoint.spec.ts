import type { IAMUserDetails } from '@src/builders';
import { collectAllFromPaginatedAwsEndpoint } from '@src/utils';
import { IAM, SecretsManager } from 'aws-sdk';

/**
 * Creates a jest mock function that pretends to be an endpoint function for an AWS Client,
 * which calls the given `promiseMockFn` function when `promise()` is called on the response.
 *
 * @param {jest.Mock<Promise<TResReturn>, [TReqParam]>} promiseMockFn
 * @return {jest.Mock<{promise: () => Promise<TResReturn>}, [TReqParam]>}
 *
 * @template TResReturn, TReqParam
 */
const createPretendClientEndpoint = <TResReturn, TReqParam>(
  promiseMockFn: jest.Mock<Promise<TResReturn>, [TReqParam]>
): jest.Mock<{ promise: () => Promise<TResReturn> }, [TReqParam]> =>
  jest
    .fn<{ promise: () => Promise<TResReturn> }, [TReqParam]>()
    .mockImplementation(param => ({
      promise: async (): Promise<TResReturn> => promiseMockFn(param)
    }));

describe('collectAllFromPaginatedAwsEndpoint', () => {
  const listUsersMock = jest.fn<
    Promise<IAM.ListUsersResponse>,
    [IAM.ListUsersRequest]
  >();

  it('calls the collector with the response from the current page', async () => {
    const responses: readonly SecretsManager.ListSecretsResponse[] = [
      { SecretList: [], NextToken: '1' },
      { SecretList: [], NextToken: '2' },
      { SecretList: [], NextToken: '3' }
    ];

    const responsesList = [...responses];

    const listSecretsMock = jest
      .fn<
        Promise<SecretsManager.ListSecretsResponse>,
        [SecretsManager.ListSecretsRequest]
      >()
      .mockImplementation(async () =>
        Promise.resolve(responsesList.shift() ?? { SecretList: [] })
      );

    const collector = jest.fn<string[], [SecretsManager.ListSecretsResponse]>(
      response =>
        (response.SecretList ?? []).map(
          (_: unknown, i: number) => `secret-${i}`
        )
    );

    await collectAllFromPaginatedAwsEndpoint(
      createPretendClientEndpoint(listSecretsMock),
      'NextToken',
      response => ({ NextToken: response?.NextToken }),
      collector
    );

    responses.forEach((res, index) =>
      expect(collector).toHaveBeenNthCalledWith(index + 1, res)
    );
  });

  it('calls the requester with the response from the previous page', async () => {
    const requester = jest.fn(response => ({ Marker: response?.Marker }));

    const responses: readonly IAM.ListUsersResponse[] = [
      { Users: [], Marker: '1' },
      { Users: [], Marker: '2' },
      { Users: [], Marker: '3' }
    ];

    const responsesList = [...responses];

    listUsersMock.mockImplementation(async () =>
      Promise.resolve(responsesList.shift() ?? { Users: [] })
    );

    await collectAllFromPaginatedAwsEndpoint(
      createPretendClientEndpoint(listUsersMock),
      'Marker',
      requester,
      response =>
        response.Users.map(
          (user): IAMUserDetails => ({
            name: user.UserName,
            path: user.Path
          })
        )
    );

    [undefined, ...responses].forEach((res, index) =>
      expect(requester).toHaveBeenNthCalledWith(index + 1, res)
    );
  });

  describe('results', () => {
    beforeEach(() => {
      const mockUsers: IAM.User[] = [...Array(3).keys()].map<IAM.User>(i => ({
        UserName: `name-${i}`,
        UserId: `id-${i}`,
        Arn: `arn-${i}`,
        Path: '/',
        CreateDate: new Date()
      }));

      listUsersMock.mockImplementation(async param => {
        const i = +(param.Marker ?? 0);
        const next = i + 1;

        return Promise.resolve({
          Users: [mockUsers[i]],
          Marker: mockUsers.length === next ? undefined : next.toString()
        });
      });
    });

    it('pushes the collected results in the results parameter array', async () => {
      const arr: string[] = [];

      const users = await collectAllFromPaginatedAwsEndpoint(
        createPretendClientEndpoint(listUsersMock),
        'Marker',
        response => ({ Marker: response?.Marker }),
        response => response.Users.map((user): string => user.UserName),
        arr
      );

      expect(arr).toHaveLength(users.length);
      expect(arr).toStrictEqual(users);
    });

    it('returns the results parameter array', async () => {
      const arr: string[] = [];

      const users = await collectAllFromPaginatedAwsEndpoint(
        createPretendClientEndpoint(listUsersMock),
        'Marker',
        response => ({ Marker: response?.Marker }),
        response => response.Users.map((user): string => user.UserName),
        arr
      );

      expect(users).toStrictEqual(arr);
      expect(users).toBe(arr);
    });
  });
});
