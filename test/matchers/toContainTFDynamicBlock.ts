import { TFBlockBody, TFDynamicBlock, TFNodeType } from '@src/types';
import { failMatcherDueToNotTFNode, isTFBlockBody } from '@test/matchers';
import { AsymmetricMatcher } from 'expect/build/asymmetricMatchers';

export {};

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Tests that the expected {@link TFBlockBody} contains only one {@link TFDynamicBlock}
       * with the given `name`
       *
       * @param {string} name
       */
      toContainTFDynamicBlock(name: string): R;
    }
  }
}

const toContainTFDynamicBlock: jest.CustomMatcher = function(
  this: jest.MatcherUtils,
  body: TFBlockBody | unknown,
  name: string | AsymmetricMatcher<unknown>
): jest.CustomMatcherResult {
  const { utils, isNot } = this;
  const matcherName = toContainTFDynamicBlock.name;
  const matcherHint = utils.matcherHint(matcherName);

  if (!isTFBlockBody(body)) {
    return failMatcherDueToNotTFNode(this, matcherName, body, TFNodeType.Body);
  }

  const dynamics = body.body.filter(
    (item): item is TFDynamicBlock =>
      item.type === TFNodeType.Block && item.blockType === 'dynamic'
  );

  const dynamicsMatchingName = dynamics.filter(dynamic =>
    this.equals(dynamic.labels[0].value, name)
  );

  const pass =
    isNot || typeof name !== 'string'
      ? dynamicsMatchingName.length > 0
      : dynamicsMatchingName.length === 1;

  return {
    pass,
    message: (): string => {
      const labelExpected = 'Expected name';
      const labelReceived = 'Received body';
      const printLabel = utils.getLabelPrinter(labelExpected, labelReceived);

      return [
        matcherHint,
        '',
        `Body contains ${utils.pluralize(
          'dynamic block',
          dynamicsMatchingName.length
        )} with the expected name.`,
        '',
        `${printLabel(labelExpected)}${utils.printExpected(name)}`,
        `${printLabel(labelReceived)}${utils.printReceived(body)}`
      ].join('\n');
    }
  };
};

expect.extend({ toContainTFDynamicBlock });
