import {
  makeTFIdentifier,
  makeTFListExpression,
  makeTFSimpleLiteral
} from '@src/makers';
import {
  TFArgument,
  TFBlockBody,
  TFIdentifier,
  TFLiteralExpression,
  TFNodeType
} from '@src/types';
import {
  failMatcherDueToNotTFNode,
  isAsymmetricMatcher,
  isTFBlockBody
} from '@test/matchers';
import type { AsymmetricMatcher } from 'expect/build/asymmetricMatchers';

export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Tests that the expected {@link TFBlockBody} contains only one `TFArgument` with
       * the given `identifier`, and that that `TFArgument` has the given`expression`.
       *
       * @param {TIdentifier} identifier
       * @param {TFLiteralExpression} expression
       *
       * @template TIdentifier
       */
      toContainTFArgumentWithExpression<TIdentifier extends string = string>(
        identifier: TIdentifier | TFIdentifier<TIdentifier>,
        expression: TFLiteralExpression | string | string[]
      ): R;
    }
  }
}

const buildExpectedExpression = (
  expression:
    | TFLiteralExpression
    | string
    | string[]
    | AsymmetricMatcher<unknown>
): TFLiteralExpression => {
  if (typeof expression === 'string' || isAsymmetricMatcher(expression)) {
    return makeTFSimpleLiteral(expression as string, {
      leadingOuterText: expect.any(String) as string,
      trailingOuterText: expect.any(String) as string
    });
  }

  if (Array.isArray(expression)) {
    return makeTFListExpression(expression);
  }

  return expression;
};

const toContainTFArgumentWithExpression: jest.CustomMatcher = function <
  TIdentifier extends string = string
>(
  this: jest.MatcherUtils,
  body: TFBlockBody<TIdentifier> | unknown,
  identifier:
    | TIdentifier
    | TFIdentifier<TIdentifier>
    | AsymmetricMatcher<unknown>,
  expression: TFLiteralExpression | string | AsymmetricMatcher<unknown>
): jest.CustomMatcherResult {
  const { utils, isNot } = this;
  const matcherName = toContainTFArgumentWithExpression.name;
  const matcherHint = utils.matcherHint(matcherName);

  if (!isTFBlockBody(body)) {
    return failMatcherDueToNotTFNode(this, matcherName, body, TFNodeType.Body);
  }

  const theIdentifier =
    typeof identifier === 'string' || isAsymmetricMatcher(identifier)
      ? makeTFIdentifier(identifier as string, {
          leadingOuterText: expect.any(String) as string,
          trailingOuterText: expect.any(String) as string
        })
      : identifier;

  const args = body.body.filter(
    (item): item is TFArgument<TIdentifier> => item.type === TFNodeType.Argument
  );

  const argsMatchingIdentifier = args.filter(arg =>
    this.equals(arg.identifier, theIdentifier)
  );

  if (argsMatchingIdentifier.length !== 1) {
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
  }

  const expressionExpected = buildExpectedExpression(expression);
  const [{ expression: expressionReceived }] = argsMatchingIdentifier;

  return {
    pass: this.equals(expressionExpected, expressionReceived),
    message: (): string => {
      const labelExpected = 'Expected expression';
      const labelReceived = 'Received expression';
      const printLabel = utils.getLabelPrinter(labelExpected, labelReceived);

      return [
        matcherHint,
        '',
        'Argument has unexpected expression.',
        '',
        `${printLabel(labelExpected)}${utils.printExpected(
          expressionExpected
        )}`,
        `${printLabel(labelReceived)}${utils.printReceived(expressionReceived)}`
      ].join('\n');
    }
  };
};

expect.extend({ toContainTFArgumentWithExpression });
