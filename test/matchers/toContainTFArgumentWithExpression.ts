import {
  TFArgument,
  TFBlockBody,
  TFLiteralExpression,
  TFNodeType
} from '@src/types';
import { failMatcherDueToNotTFBlockBody, isTFBlockBody } from '@test/matchers';
import { AsymmetricMatcher } from 'expect/build/asymmetricMatchers';

export {};

declare global {
  namespace jest {
    interface Matchers<R, T> {
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
        identifier: TIdentifier,
        expression: TFLiteralExpression
      ): R;
    }
  }
}

const toContainTFArgumentWithExpression: jest.CustomMatcher = function<
  TIdentifier extends string = string
>(
  this: jest.MatcherUtils,
  body: TFBlockBody<TIdentifier> | unknown,
  identifier: TIdentifier | AsymmetricMatcher<unknown>,
  expression: TFLiteralExpression
): jest.CustomMatcherResult {
  const { utils, isNot } = this;
  const matcherName = toContainTFArgumentWithExpression.name;
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

  if (argsMatchingIdentifier.length !== 1) {
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
  }

  const expressionExpected = expression;
  const [{ expression: expressionReceived }] = argsMatchingIdentifier;

  return {
    pass: this.equals(expressionExpected, expressionReceived),
    message: () => {
      const labelExpected = 'Expected expression';
      const labelReceived = 'Received expression';
      const printLabel = utils.getLabelPrinter(labelExpected, labelReceived);

      return [
        matcherHint,
        '',
        'Argument has unexpected expression.',
        '',
        `${printLabel(labelExpected)}${utils.printExpected(expression)}`,
        `${printLabel(labelReceived)}${utils.printReceived(expressionReceived)}`
      ].join('\n');
    }
  };
};

expect.extend({ toContainTFArgumentWithExpression });
