import { makeTFResourceBlock } from '@src/makers';
import { printFileAST, printResourceBlock } from '@src/printers';
import { TFNodeType } from '@src/types';
import { mocked } from 'ts-jest/utils';

jest.mock('@src/printers/printResourceBlock');

const printResourceBlockMock = mocked(printResourceBlock);

describe('printFileAST', () => {
  describe('when the AST contains a resource block', () => {
    it('uses printResourceBlock', () => {
      const resource = makeTFResourceBlock('my-type', 'my-resource', []);

      printFileAST([resource]);

      expect(printResourceBlockMock).toHaveBeenCalledWith(resource);
    });
  });

  describe('when the AST is empty', () => {
    it('prints nothing', () => {
      expect(printFileAST([])).toBe('');
    });
  });

  describe('when the block type is not supported', () => {
    it('throws an error', () => {
      expect(() =>
        printFileAST([
          {
            type: TFNodeType.Module,
            name: 'my module',
            body: []
          }
        ])
      ).toThrow(`"${TFNodeType.Module}" is not yet supported`);
    });
  });
});
