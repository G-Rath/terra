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

  return {
    blocks: cloneBlocks(fileContents.blocks),
    surroundingText: { ...fileContents.surroundingText }
  };
};
