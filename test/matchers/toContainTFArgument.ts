import {
  TFArgument,
  TFBlockBody,
  TFLiteralExpression,
  TFNodeType
} from '@src/types';
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
      toContainTFArgument<TIdentifier extends string = string>(
        identifier: TIdentifier,
        expression: TFLiteralExpression
      ): R;
    }
  }
}

const toContainTFArgument: jest.CustomMatcher = function<
  TIdentifier extends string = string
>(
  this: jest.MatcherUtils,
  body: TFBlockBody<TIdentifier>,
  identifier: TIdentifier | AsymmetricMatcher<unknown>,
  expression: TFLiteralExpression
): jest.CustomMatcherResult {
  const { utils, isNot } = this;
  const matcherName = toContainTFArgument.name;
  const matcherHint = utils.matcherHint(matcherName);

  const args = body.filter(
    (item): item is TFArgument<TIdentifier> => item.type === TFNodeType.Argument
  );

  const argsMatchingIdentifier = args.filter(arg =>
    this.equals(arg.identifier, identifier)
  );

  if (argsMatchingIdentifier.length !== (isNot ? 0 : 1)) {
    const pass = // if type is not string, it'll be an expect.<something>, so allow multiple
      typeof identifier === 'string' ? false : !!argsMatchingIdentifier.length;

    return {
      pass: isNot ? !pass : pass,
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

  const [argument] = argsMatchingIdentifier;

  return {
    pass: !isNot && this.equals(argument.expression, expression),
    message: () => {
      const labelExpected = 'Expected expression';
      const labelReceived = 'Received argument';
      const printLabel = utils.getLabelPrinter(labelExpected, labelReceived);

      return [
        matcherHint,
        '',
        'Argument has unexpected expression.',
        '',
        `${printLabel(labelExpected)}${utils.printExpected(expression)}`,
        `${printLabel(labelReceived)}${utils.printReceived(argument)}`
      ].join('\n');
    }
  };
};

expect.extend({ toContainTFArgument });
