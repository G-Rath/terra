import { TFFileAST, TFTopLevelBlock } from '@src/types';

export interface TFParser<T> {
  parse(char: string): boolean;
  collect(): T;
}

export type TFTopLevelParser = TFParser<TFTopLevelBlock>;

/**
 * Parses the contents of a Terraform file, generating an AST representation.
 *
 * @param {string} contents
 *
 * @return {TFFileAST}
 */
export const parseTFFileContents = (contents: string): TFFileAST => {
  const ast: TFFileAST = [];

  let parser: TFTopLevelParser | null = null;
  let buffer = '';

  for (const char of contents) {
    if (parser) {
      continue;
    }

    buffer += char;
  }

  return ast;
};
