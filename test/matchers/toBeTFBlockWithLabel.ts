import { makeTFLabel } from '@src/makers';
import { TFBlock, TFLabel, TFNodeType } from '@src/types';
import { failMatcherDueToNotTFNode, isTFBlock } from '@test/matchers';
import type { AsymmetricMatcher } from 'expect/build/asymmetricMatchers';

export {};

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Tests that the expected is a `TFBlock` with the given label in the given position.
       *
       * @param {string} label
       * @param {number} [position]
       */
      toBeTFBlockWithLabel(label: string | TFLabel, position: number): R;
    }
  }
}

const toBeTFBlockWithLabel: jest.CustomMatcher = function (
  this: jest.MatcherUtils,
  block: TFBlock | unknown,
  value: string | TFLabel | AsymmetricMatcher<unknown>,
  position: number
): jest.CustomMatcherResult {
  const { utils, isNot } = this;
  const matcherName = toBeTFBlockWithLabel.name;
  const matcherHint = utils.matcherHint(matcherName);

  if (!isTFBlock(block)) {
    return failMatcherDueToNotTFNode(
      this,
      matcherName,
      block,
      TFNodeType.Block
    );
  }

  if (block.labels.length < position + 1) {
    return {
      pass: isNot,
      message: (): string => {
        const labelExpected = 'Expected';
        const labelReceived = 'Received';
        const printLabel = utils.getLabelPrinter(labelExpected, labelReceived);

        return [
          matcherHint,
          '',
          'Block contains fewer labels than expected.',
          '',
          `${printLabel(labelExpected)}${utils.printExpected(position + 1)}`,
          `${printLabel(labelReceived)}${utils.printReceived(
            block.labels.length
          )}`
        ].join('\n');
      }
    };
  }

  const expectedLabel = typeof value === 'string' ? makeTFLabel(value) : value;
  const receivedLabel = block.labels[position];

  return {
    pass: this.equals(expectedLabel, receivedLabel),
    message: (): string => {
      const labelExpected = 'Expected label';
      const labelReceived = 'Received label';
      const printLabel = utils.getLabelPrinter(labelExpected, labelReceived);

      return [
        matcherHint,
        '',
        'Labels are not equal',
        '',
        `${printLabel(labelExpected)}${utils.printExpected(expectedLabel)}`,
        `${printLabel(labelReceived)}${utils.printReceived(receivedLabel)}`
      ].join('\n');
    }
  };
};

expect.extend({ toBeTFBlockWithLabel });
