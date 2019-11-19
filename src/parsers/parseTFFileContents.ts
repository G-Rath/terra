import { logger, TFResourceParser } from '@src/parsers';
import { TFFileAST, TFTopLevelBlock } from '@src/types';

export interface TFParser<T = any> {
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

  const parseAndCollect = (char: string, innerParser: TFTopLevelParser) => {
    if (!innerParser.parse(char)) {
      return;
    }

    ast.push(innerParser.collect());
    parser = null;
  };

  for (const char of contents) {
    if (parser) {
      parseAndCollect(char, parser);

      continue;
    }

    // a space or a double quote denote a separator
    // hitting either means it's time to check the buffer
    if (char === ' ' || char === '"') {
      if (buffer === 'resource') {
        parser = new TFResourceParser();

        parseAndCollect(char, parser);

        continue;
      }

      throw new Error('unknown block');
    }

    buffer += char;
  }

  return ast;
};
