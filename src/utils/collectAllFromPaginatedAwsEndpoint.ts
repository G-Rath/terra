/**
 * Collects all the data from the given AWS Client endpoint by iterating
 * over the paginated results until the `tokenProp` is no longer in the response.
 *
 * @param {(request: TRequest) => Request<TResponse, AWSError>} apiCaller
 * @param {keyof TResponse} tokenProp
 * @param {(previousResponse?: TResponse) => TRequest} requester
 * @param {(currentResponse: TResponse) => TType[]} collector
 * @param {TType[]} results
 *
 * @return {Promise<TType[]>}
 *
 * @template TType
 */
export const collectAllFromPaginatedAwsEndpoint = async <
  TType,
  TReq extends object,
  TRes extends object
>(
  apiCaller: (request: TReq) => { promise: () => Promise<TRes> },
  tokenProp: keyof Omit<TRes, '$response'>,
  requester: (previous: TRes | undefined) => TReq,
  collector: (response: TRes) => TType[],
  results: TType[] = []
): Promise<TType[]> => {
  let response: TRes | undefined;

  do {
    // eslint-disable-next-line no-await-in-loop
    response = await apiCaller(requester(response)).promise();

    results.push(...collector(response));
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } while (response[tokenProp]);

  return results;
};
