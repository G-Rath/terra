import { makeTFResourceBlock } from '@src/makers';
import * as printer from '@src/printer';
import { printFileAST } from '@src/printers';
import { TFNodeType } from '@src/types';

describe('printFileAST', () => {
  describe('when the AST contains a block', () => {
    it('uses printTFBlock', () => {
      const printTFBlockSpy = jest.spyOn(printer, 'printTFBlock');
      const resource = makeTFResourceBlock('my-type', 'my-resource', []);

      printFileAST([resource]);

      expect(printTFBlockSpy).toHaveBeenCalledWith(resource);
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
