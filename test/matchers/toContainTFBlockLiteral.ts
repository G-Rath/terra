import { TFBlockBody, TFBlockLiteral, TFNodeType } from '@src/types';
import { AsymmetricMatcher } from 'expect/build/asymmetricMatchers';

export {};

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Tests that the expected {@link TFBlockBody} contains only one {@link TFBlockLiteral}
       * with the given `name`
       *
       * @param {string} name
       */
      toContainTFBlockLiteral(name: string): R;
    }
  }
}

const toContainTFBlockLiteral: jest.CustomMatcher = function(
  this: jest.MatcherUtils,
  bodi: TFBlockBody,
  name: string | AsymmetricMatcher<unknown>
): jest.CustomMatcherResult {
  const { utils, isNot } = this;
  const matcherName = toContainTFBlockLiteral.name;
  const matcherHint = utils.matcherHint(matcherName);

  const blocks = bodi.filter(
    (item): item is TFBlockLiteral => item.type === TFNodeType.Block
  );

  const blocksMatchingName = blocks.filter(block =>
    this.equals(block.name, name)
  );

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
};

expect.extend({ toContainTFBlockLiteral });
