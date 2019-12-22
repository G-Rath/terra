import { parseTFBlock, StringCursor } from '@src/parser';
import { TFBlock, TFFileContents } from '@src/types';

/**
 * Parses the contents of a Terraform file, generating an AST representation.
 *
 * @param {string} contents
 * @param {boolean} record
 *
 * @return {TFBlocks}
 */
export const parseTFFileContents = (
  contents: string,
  record = false
): TFFileContents => {
  const cursor = new StringCursor(contents, record ? undefined : null);
  const blocks: TFBlock[] = [];
  let trailingOuterTextPosition = cursor.position;

  try {
    while (!cursor.isAtEnd()) {
      try {
        cursor.collectUntilWithComments(/\w/);
      } catch (err) {
        if (!cursor.isAtEnd()) {
          throw err;
        }
      }

      if (cursor.isAtEnd()) {
        break;
      }

      cursor.rewind(cursor.position - trailingOuterTextPosition);

      blocks.push(parseTFBlock(cursor));
      trailingOuterTextPosition = cursor.position;
    }
  } finally {
    cursor.recorder?.writeToDisk('recordings');
  }

  return {
    blocks,
    surroundingText: {
      leadingOuterText: '',
      trailingOuterText: contents.slice(trailingOuterTextPosition)
    }
  };
};
