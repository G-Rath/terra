import { TokenType, ensureTextEndsWithTokens, ensurers } from '@src/formatter';
import type { TFFileContents } from '@src/types';

const cloneBlocks = (
  blocks: TFFileContents['blocks']
): TFFileContents['blocks'] => JSON.parse(JSON.stringify(blocks));

export const format = (fileContents: TFFileContents): TFFileContents => {
  if (fileContents.blocks.length === 0) {
    return {
      blocks: cloneBlocks(fileContents.blocks),
      surroundingText: { ...fileContents.surroundingText }
    };
  }

  const surroundingText = {
    ...fileContents.surroundingText,
    trailingOuterText: ensureTextEndsWithTokens(
      fileContents.surroundingText.trailingOuterText,
      [{ type: TokenType.Newline }]
    )
  };

  return {
    blocks: ensurers.reduce(
      (blocks, ensurer) => ensurer(blocks),
      cloneBlocks(fileContents.blocks)
    ),
    surroundingText
  };
};
