import { ensureTopLevelBlocksAreSeparated } from '@src/formatter';
import { makeTFBlock } from '@src/makers';
import { TFBlock } from '@src/types';

describe('ensureTopLevelBlocksAreSeparated', () => {
  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(ensureTopLevelBlocksAreSeparated([])).toStrictEqual([]);
    });
  });

  describe('when there is only one block', () => {
    it('does not add a newline', () => {
      const [{ surroundingText }] = ensureTopLevelBlocksAreSeparated([
        makeTFBlock('resource', [], [])
      ]);

      expect(surroundingText).toStrictEqual<TFBlock['surroundingText']>({
        leadingOuterText: '',
        trailingOuterText: ''
      });
    });
  });

  describe('when there are multiple blocks', () => {
    it('separates them with a blank line', () => {
      const [
        { surroundingText: firstBlockText },
        { surroundingText: secondBlockText }
      ] = ensureTopLevelBlocksAreSeparated([
        makeTFBlock('resource', [], [], {
          leadingOuterText: '',
          trailingOuterText: ''
        }),
        makeTFBlock('resource', [], [], {
          leadingOuterText: '',
          trailingOuterText: ''
        })
      ]);

      expect(firstBlockText).toStrictEqual<TFBlock['surroundingText']>({
        leadingOuterText: '',
        trailingOuterText: ''
      });
      expect(secondBlockText).toStrictEqual<TFBlock['surroundingText']>({
        leadingOuterText: '\n\n',
        trailingOuterText: ''
      });
    });

    it('ensures a blank line between blocks', () => {
      const [
        { surroundingText: firstBlockText },
        { surroundingText: secondBlockText }
      ] = ensureTopLevelBlocksAreSeparated([
        makeTFBlock('resource', [], [], {
          leadingOuterText: '',
          trailingOuterText: ''
        }),
        makeTFBlock('resource', [], [], {
          leadingOuterText: '\n',
          trailingOuterText: ''
        })
      ]);

      expect(firstBlockText).toStrictEqual<TFBlock['surroundingText']>({
        leadingOuterText: '',
        trailingOuterText: ''
      });
      expect(secondBlockText).toStrictEqual<TFBlock['surroundingText']>({
        leadingOuterText: '\n\n',
        trailingOuterText: ''
      });
    });

    describe('when they are already separated', () => {
      it('does not add more blank lines', () => {
        const [
          { surroundingText: firstBlockText },
          { surroundingText: secondBlockText }
        ] = ensureTopLevelBlocksAreSeparated([
          makeTFBlock('resource', [], [], {
            leadingOuterText: '',
            trailingOuterText: ''
          }),
          makeTFBlock('resource', [], [], {
            leadingOuterText: '\n\n',
            trailingOuterText: ''
          })
        ]);

        expect(firstBlockText).toStrictEqual<TFBlock['surroundingText']>({
          leadingOuterText: '',
          trailingOuterText: ''
        });
        expect(secondBlockText).toStrictEqual<TFBlock['surroundingText']>({
          leadingOuterText: '\n\n',
          trailingOuterText: ''
        });
      });
    });
  });
});
