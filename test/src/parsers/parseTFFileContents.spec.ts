import { parseTFFileContents } from '@src/parsers';

describe('parseTFFileContents', () => {
  describe('when the content is empty', () => {
    it('returns empty AST', () => {
      const ast = parseTFFileContents('');

      expect(ast).toHaveLength(0);
    });
  });
});
