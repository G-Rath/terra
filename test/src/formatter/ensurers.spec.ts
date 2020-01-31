import {
  ensureClosingBraceOnNewline,
  ensureLabelsHaveLeadingSpace,
  ensureTopLevelBlocksAreSeparated
} from '@src/formatter';
import { makeTFBlock, makeTFLabel } from '@src/makers';
import { parseTFFileContents } from '@src/parser';
import { printTFBlocks } from '@src/printer';
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

describe('ensureLabelsHaveLeadingSpace', () => {
  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(ensureLabelsHaveLeadingSpace([])).toStrictEqual([]);
    });
  });

  describe('when there are no labels', () => {
    it('does nothing', () => {
      expect(
        ensureLabelsHaveLeadingSpace([
          makeTFBlock('resource', [], [], {
            leadingOuterText: '',
            trailingOuterText: ''
          }),
          makeTFBlock('resource', [], [], {
            leadingOuterText: '',
            trailingOuterText: ''
          })
        ])
      ).toStrictEqual([
        makeTFBlock('resource', [], [], {
          leadingOuterText: '',
          trailingOuterText: ''
        }),
        makeTFBlock('resource', [], [], {
          leadingOuterText: '',
          trailingOuterText: ''
        })
      ]);
    });
  });

  describe('when there are labels', () => {
    it('ensures all labels have a leading space', () => {
      expect(
        ensureLabelsHaveLeadingSpace([
          makeTFBlock(
            'resource',
            [
              makeTFLabel('aws_route53_zone', {
                leadingOuterText: '',
                trailingOuterText: ''
              }),
              makeTFLabel('my_zone', {
                leadingOuterText: ' ',
                trailingOuterText: ''
              })
            ],
            []
          ),
          makeTFBlock(
            'resource',
            [
              makeTFLabel('my_zone', {
                leadingOuterText: ' ',
                trailingOuterText: ''
              })
            ],
            []
          )
        ])
      ).toStrictEqual([
        makeTFBlock(
          'resource',
          [
            makeTFLabel('aws_route53_zone', {
              leadingOuterText: ' ',
              trailingOuterText: ''
            }),
            makeTFLabel('my_zone', {
              leadingOuterText: ' ',
              trailingOuterText: ''
            })
          ],
          []
        ),
        makeTFBlock(
          'resource',
          [
            makeTFLabel('my_zone', {
              leadingOuterText: ' ',
              trailingOuterText: ''
            })
          ],
          []
        )
      ]);
    });
  });
});

describe('ensureClosingBraceOnNewline', () => {
  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(ensureClosingBraceOnNewline([])).toStrictEqual([]);
    });
  });

  it('formats Map and Body nodes', () => {
    expect(
      printTFBlocks(
        ensureClosingBraceOnNewline(
          parseTFFileContents('locals { map = { key = value } }').blocks
        )
      )
    ).toMatchInlineSnapshot(`
      "locals { map = { key = value
       }
       }"
    `);
  });

  it('handles trailing commas', () => {
    expect(
      printTFBlocks(
        ensureClosingBraceOnNewline(
          parseTFFileContents('locals { map = { key = value, } }').blocks
        )
      )
    ).toMatchInlineSnapshot(`
        "locals { map = { key = value,
         }
         }"
      `);
  });

  describe('when closing braces are already on a newline', () => {
    it('leaves them be', () => {
      expect(
        printTFBlocks(
          ensureClosingBraceOnNewline(
            parseTFFileContents(
              `
locals {
  map = {
    key = value
  }
}
              `.trim()
            ).blocks
          )
        )
      ).toMatchInlineSnapshot(`
        "locals {
          map = {
            key = value
          }
        }"
      `);
    });
  });
});
