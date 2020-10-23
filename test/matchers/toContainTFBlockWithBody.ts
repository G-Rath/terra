import { TFBlock, TFBlockBody, TFBlockBodyBody, TFNodeType } from '@src/types';
import { failMatcherDueToNotTFNode, isTFBlockBody } from '@test/matchers';
import type { AsymmetricMatcher } from 'expect/build/asymmetricMatchers';

export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Tests that the expected {@link TFBlockBody} contains only one {@link TFBlock}
       * with the given `blockType`, and with the given `body`.
       *
       * @param {string} blockType
       * @param {TFBlockBodyBody} body
       */
      toContainTFBlockWithBody(blockType: string, body: TFBlockBodyBody): R;
    }
  }
}

const toContainTFBlockWithBody: jest.CustomMatcher = function (
  this: jest.MatcherUtils,
  bodi: TFBlockBody | unknown,
  blockType: string | AsymmetricMatcher<unknown>,
  body: TFBlockBodyBody
): jest.CustomMatcherResult {
  const { utils, isNot } = this;
  const matcherName = toContainTFBlockWithBody.name;
  const matcherHint = utils.matcherHint(matcherName);

  if (!isTFBlockBody(bodi)) {
    return failMatcherDueToNotTFNode(this, matcherName, bodi, TFNodeType.Body);
  }

  const blocks = bodi.body.filter(
    (item): item is TFBlock => item.type === TFNodeType.Block
  );

  const blocksMatchingName = blocks.filter(block =>
    this.equals(block.blockType, blockType)
  );

  if (blocksMatchingName.length !== 1) {
    // if type is not string, it'll be an expect.<something>, so allow multiple
    const pass =
      isNot || typeof blockType !== 'string'
        ? blocksMatchingName.length > 0
        : blocksMatchingName.length === 1;

    return {
      pass,
      message: (): string => {
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
  }

  const bodyExpected = body;
  const [{ body: bodyReceived }] = blocksMatchingName.map(block => block.body);

  const pass = this.equals(bodyExpected, bodyReceived);

  return {
    pass,
    message: (): string =>
      [
        matcherHint,
        '',
        'Block body does not match as expected.',
        '',
        this.utils.diff(bodyExpected, bodyReceived)
      ].join('\n')
  };
};

expect.extend({ toContainTFBlockWithBody });
