import { makeTFIdentifier } from '@src/makers';
import { TFArgument, TFBlockBody, TFIdentifier, TFNodeType } from '@src/types';
import {
  failMatcherDueToNotTFNode,
  isAsymmetricMatcher,
  isTFBlockBody
} from '@test/matchers';
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
        identifier: TIdentifier | TFIdentifier<TIdentifier>
      ): R;
    }
  }
}

const toContainTFArgument: jest.CustomMatcher = function <
  TIdentifier extends string = string
>(
  this: jest.MatcherUtils,
  body: TFBlockBody<TIdentifier> | unknown,
  identifier:
    | TIdentifier
    | TFIdentifier<TIdentifier>
    | AsymmetricMatcher<unknown>
): jest.CustomMatcherResult {
  const { utils, isNot } = this;
  const matcherName = toContainTFArgument.name;
  const matcherHint = utils.matcherHint(matcherName);

  if (!isTFBlockBody(body)) {
    return failMatcherDueToNotTFNode(this, matcherName, body, TFNodeType.Body);
  }

  const theIdentifier =
    typeof identifier === 'string' || isAsymmetricMatcher(identifier)
      ? makeTFIdentifier(identifier as string, {
          leadingOuterText: expect.any(String),
          trailingOuterText: expect.any(String)
        })
      : identifier;

  const args = body.body.filter(
    (item): item is TFArgument<TIdentifier> => item.type === TFNodeType.Argument
  );

  const argsMatchingIdentifier = args.filter(arg =>
    this.equals(arg.identifier, theIdentifier)
  );

  // if type is not string, it'll be an expect.<something>, so allow multiple
  const pass =
    isNot || isAsymmetricMatcher(identifier)
      ? argsMatchingIdentifier.length > 0
      : argsMatchingIdentifier.length === 1;

  return {
    pass,
    message: (): string => {
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
        `${printLabel(labelExpected)}${utils.printExpected(theIdentifier)}`,
        `${printLabel(labelReceived)}${utils.printReceived(body)}`
      ].join('\n');
    }
  };
};

expect.extend({ toContainTFArgument });
