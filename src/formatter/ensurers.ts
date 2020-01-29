import {
  TokenType,
  ensureTextStartsWithTokens,
  parseSurroundingText,
  printTokens
} from '@src/formatter';
import { TFBlock } from '@src/types';

export type Ensurer = (blocks: TFBlock[]) => TFBlock[];

export const ensureTopLevelBlocksAreSeparated: Ensurer = blocks => {
  if (blocks.length <= 1) {
    return blocks;
  }

  return [
    blocks[0],
    ...blocks.slice(1).map(block => {
      const { leadingOuterText } = block.surroundingText;

      const parsedText = parseSurroundingText(leadingOuterText);

      const firstNewlineTokenIndex = parsedText.findIndex(
        token => token.type === TokenType.Newline
      );

      if (firstNewlineTokenIndex === -1) {
        parsedText.splice(
          firstNewlineTokenIndex,
          0,
          { type: TokenType.Newline },
          { type: TokenType.Newline }
        );
      } else if (
        parsedText.length <= firstNewlineTokenIndex + 1 ||
        parsedText[firstNewlineTokenIndex + 1].type !== TokenType.Newline
      ) {
        parsedText.splice(firstNewlineTokenIndex, 0, {
          type: TokenType.Newline
        });
      }

      return {
        ...block,
        surroundingText: {
          ...block.surroundingText,
          leadingOuterText: printTokens(parsedText)
        }
      };
    })
  ];
};

export const ensureLabelsHaveLeadingSpace: Ensurer = blocks =>
  blocks.map(block => ({
    ...block,
    labels: block.labels.map(label => ({
      ...label,
      surroundingText: {
        ...label.surroundingText,
        leadingOuterText: ensureTextStartsWithTokens(
          label.surroundingText.leadingOuterText,
          [{ type: TokenType.Whitespace, content: ' ' }]
        )
      }
    }))
  }));

export const ensurers: readonly Ensurer[] = Object.freeze([
  ensureTopLevelBlocksAreSeparated,
  ensureLabelsHaveLeadingSpace
]);
