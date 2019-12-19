import { makeTFResourceBlock } from '@src/makers';
import * as printer from '@src/printer';
import { printFileAST } from '@src/printers';

describe('printFileAST', () => {
  describe('when the AST contains a block', () => {
    it('uses printTFBlock in a map', () => {
      const printTFBlockSpy = jest.spyOn(printer, 'printTFBlock');
      const resource = makeTFResourceBlock('my-type', 'my-resource', []);

      printFileAST([resource]);

      // map callback is passed [value, index, array]
      expect(printTFBlockSpy).toHaveBeenCalledWith(
        resource,
        0,
        expect.arrayContaining([resource])
      );
    });
  });

  describe('when the AST is empty', () => {
    it('prints nothing', () => {
      expect(printFileAST([])).toBe('');
    });
  });
});
