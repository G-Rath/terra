import type { Ensurer } from '@src/formatter';
import { parseTFFileContents } from '@src/parser';
import { printTFBlocks } from '@src/printer';
import dedent from 'dedent';

export const makeFormatter = (ensurer: Ensurer) => (
  contents: string | TemplateStringsArray
): string => {
  const actualContents =
    typeof contents === 'string' ? contents : contents.raw.join('');

  return printTFBlocks(
    ensurer(parseTFFileContents(dedent(actualContents)).blocks)
  );
};
