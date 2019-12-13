import { TFArgument, TFBlockBody, TFNodeType } from '@src/types';
import { failMatcherDueToNotTFBlockBody, isTFBlockBody } from '@test/matchers';
import { AsymmetricMatcher } from 'expect/build/asymmetricMatchers';

export {};

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Tests that the expected {@link TFBlockBody} contains only one `TFArgument` with
       * the given `identifier`.
       *
       * @param {TIdentifier} identifier
       *
       * @template TIdentifier
       */
      toContainTFArgument<TIdentifier extends string = string>(
        identifier: TIdentifier
      ): R;
    }
  }
}

const toContainTFArgument: jest.CustomMatcher = function<
  TIdentifier extends string = string
>(
  this: jest.MatcherUtils,
  body: TFBlockBody<TIdentifier> | unknown,
  identifier: TIdentifier | AsymmetricMatcher<unknown>
): jest.CustomMatcherResult {
  const { utils, isNot } = this;
  const matcherName = toContainTFArgument.name;
  const matcherHint = utils.matcherHint(matcherName);

  if (!isTFBlockBody(body)) {
    return failMatcherDueToNotTFBlockBody(this, matcherName, body);
  }

  const args = body.body.filter(
    (item): item is TFArgument<TIdentifier> => item.type === TFNodeType.Argument
  );

  const argsMatchingIdentifier = args.filter(arg =>
    this.equals(arg.identifier, identifier)
  );

  // if type is not string, it'll be an expect.<something>, so allow multiple
  const pass =
    isNot || typeof identifier !== 'string'
      ? argsMatchingIdentifier.length > 0
      : argsMatchingIdentifier.length === 1;

  return {
    pass,
    message: () => {
      const labelExpected = 'Expected identifier';
      const labelReceived = 'Received body';
      const printLabel = utils.getLabelPrinter(labelExpected, labelReceived);

      return [
        matcherHint,
        '',
        `Body contains ${utils.pluralize(
          'argument',
          argsMatchingIdentifier.length
        )} with the expected identifier.`,
        '',
        `${printLabel(labelExpected)}${utils.printExpected(identifier)}`,
        `${printLabel(labelReceived)}${utils.printReceived(body)}`
      ].join('\n');
    }
  };
};

expect.extend({ toContainTFArgument });
