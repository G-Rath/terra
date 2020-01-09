type AWSClientMap = typeof import('aws-sdk/clients/all');

/** Map of `aws-sdk` clients to their mocked endpoints */
const clientMocks: { [K in keyof AWSClientMap]?: unknown } = {};

export const mockAwsClientEndpoints = <
  TClient extends keyof AWSClientMap,
  TEndpoint extends keyof InstanceType<AWSClientMap[TClient]>,
  TMockedEndpoints extends Partial<Record<TEndpoint, jest.Mock>>
>(
  client: TClient,
  mockedEndpoints: TMockedEndpoints
): TMockedEndpoints => {
  const clientProxy = new Proxy(
    {},
    {
      construct(): object {
        return clientProxy;
      },
      get(t, property: TEndpoint) {
        const endpointMock = mockedEndpoints[property];

        if (endpointMock) {
          return (...args: unknown[]) => ({
            promise: () => endpointMock(...args)
          });
        }

        throw new Error(
          `${client}#${property} was called without being mocked`
        );
      }
    }
  );

  clientMocks[client] = clientProxy;

  return mockedEndpoints;
};

jest.mock('aws-sdk', () => clientMocks);
