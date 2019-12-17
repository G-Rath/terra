import { TFBlock, TFBlockBody, TFNodeType } from '@src/types';
import { failMatcherDueToNotTFBlockBody, isTFBlockBody } from '@test/matchers';
import { AsymmetricMatcher } from 'expect/build/asymmetricMatchers';

export {};

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Tests that the expected {@link TFBlockBody} contains only one {@link TFBlock}
       * with the given `blockType`
       *
       * @param {string} blockType
       */
      toContainTFBlock(blockType: string): R;
    }
  }
}

const toContainTFBlock: jest.CustomMatcher = function(
  this: jest.MatcherUtils,
  bodi: TFBlockBody | unknown,
  blockType: string | AsymmetricMatcher<unknown>
): jest.CustomMatcherResult {
  const { utils, isNot } = this;
  const matcherName = toContainTFBlock.name;
  const matcherHint = utils.matcherHint(matcherName);

  if (!isTFBlockBody(bodi)) {
    return failMatcherDueToNotTFBlockBody(this, matcherName, bodi);
  }

  const blocks = bodi.body.filter(
    (item): item is TFBlock => item.type === TFNodeType.Block
  );

  const blocksMatchingName = blocks.filter(block =>
    this.equals(block.blockType, blockType)
  );

  // if type is not string, it'll be an expect.<something>, so allow multiple
  const pass =
    isNot || typeof blockType !== 'string'
      ? blocksMatchingName.length > 0
      : blocksMatchingName.length === 1;

  return {
    pass,
    message: () => {
      const labelExpected = 'Expected blockType';
      const labelReceived = 'Received body';
      const printLabel = utils.getLabelPrinter(labelExpected, labelReceived);

      return [
        matcherHint,
        '',
        `Body contains ${utils.pluralize(
          'block',
          blocksMatchingName.length
        )} with the expected name.`,
        '',
        `${printLabel(labelExpected)}${utils.printExpected(blockType)}`,
        `${printLabel(labelReceived)}${utils.printReceived(bodi)}`
      ].join('\n');
    }
  };
};

expect.extend({ toContainTFBlock });
