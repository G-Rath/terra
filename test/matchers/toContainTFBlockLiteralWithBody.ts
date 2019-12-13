import { TFBlockBodyBody, TFBlockLiteral, TFNodeType } from '@src/types';
import { AsymmetricMatcher } from 'expect/build/asymmetricMatchers';

export {};

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Tests that the expected {@link TFBlockBodyBody} contains only one {@link TFBlockLiteral}
       * with the given `name`, and with the given `body`.
       *
       * @param {string} name
       * @param {TFBlockBodyBody} body
       */
      toContainTFBlockLiteralWithBody(name: string, body: TFBlockBodyBody): R;
    }
  }
}

const toContainTFBlockLiteralWithBody: jest.CustomMatcher = function(
  this: jest.MatcherUtils,
  bodi: TFBlockBodyBody,
  name: string | AsymmetricMatcher<unknown>,
  body: TFBlockBodyBody
): jest.CustomMatcherResult {
  const { utils, isNot } = this;
  const matcherName = toContainTFBlockLiteralWithBody.name;
  const matcherHint = utils.matcherHint(matcherName);

  const blocks = bodi.filter(
    (item): item is TFBlockLiteral => item.type === TFNodeType.Block
  );

  const blocksMatchingName = blocks.filter(block =>
    this.equals(block.name, name)
  );

  if (blocksMatchingName.length !== 1) {
    // if type is not string, it'll be an expect.<something>, so allow multiple
    const pass =
      isNot || typeof name !== 'string'
        ? blocksMatchingName.length > 0
        : blocksMatchingName.length === 1;

    return {
      pass,
      message: () => {
        const labelExpected = 'Expected name';
        const labelReceived = 'Received body';
        const printLabel = utils.getLabelPrinter(labelExpected, labelReceived);

        return [
          matcherHint,
          '',
          `Body contains ${utils.pluralize(
            'block literal',
            blocksMatchingName.length
          )} with the expected name.`,
          '',
          `${printLabel(labelExpected)}${utils.printExpected(name)}`,
          `${printLabel(labelReceived)}${utils.printReceived(bodi)}`
        ].join('\n');
      }
    };
  }

  const bodyExpected = body;
  const [{ body: bodyReceived }] = blocksMatchingName;

  const pass = this.equals(bodyExpected, bodyReceived);

  return {
    pass,
    message: () =>
      [
        matcherHint,
        '',
        'Block literal body does not match as expected.',
        '',
        this.utils.diff(bodyExpected, bodyReceived)
      ].join('\n')
  };
};

expect.extend({ toContainTFBlockLiteralWithBody });
