import { TokenType, ensureTextEndsWithTokens } from '@src/formatter';
import * as ensurers from '@src/formatter/ensurers';
import { TFFileContents } from '@src/types';

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
    blocks: Object.values(ensurers)
      .filter(v => typeof v === 'function')
      .reduce(
        (blocks, ensurer) => ensurer(blocks),
        cloneBlocks(fileContents.blocks)
      ),
    surroundingText
  };
};
