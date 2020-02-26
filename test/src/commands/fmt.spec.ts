import { Fmt } from '@src/commands';
import * as formatter from '@src/formatter';
import {
  DiscardSurroundingTextBehaviour,
  discardSurroundingText
} from '@src/formatter';
import * as printers from '@src/printer';
import { cwdAsJson } from '@test/setupMockFs';
import { vol } from 'memfs';

describe('fmt', () => {
  const mockPrintContents = 'hello world';
  let logSpy: jest.SpiedFunction<typeof Fmt.prototype.log>;
  let printTFFileContentsSpy: jest.SpiedFunction<typeof printers.printTFFileContents>;

  beforeEach(() => {
    vol.fromJSON({ 'file.tf': 'local { myValue=1 }\n' }, process.cwd());
    logSpy = jest.spyOn(Fmt.prototype, 'log');
    printTFFileContentsSpy = jest
      .spyOn(printers, 'printTFFileContents')
      .mockReturnValue(mockPrintContents);
  });

  describe('flags', () => {
    describe('--discardSurroundingText', () => {
      describe('when the flag is absent', () => {
        it('does not discard any surrounding text', async () => {
          const discardSurroundingTextSpy = jest.spyOn(
            formatter,
            'discardSurroundingText'
          );

          await Fmt.run(['file.tf']);

          expect(discardSurroundingTextSpy).not.toHaveBeenCalledWith();
        });
      });

      describe('when the flag is present', () => {
        it('uses the provided behaviour', async () => {
          const theBehaviour: DiscardSurroundingTextBehaviour = 'all';
          const discardSurroundingTextSpy = jest.spyOn(
            formatter,
            'discardSurroundingText'
          );

          await Fmt.run(['--discardSurroundingText', theBehaviour, 'file.tf']);

          expect(discardSurroundingTextSpy).toHaveBeenCalledWith<
            Parameters<typeof discardSurroundingText>
          >(
            {
              blocks: expect.any(Array),
              surroundingText: expect.any(Object)
            },
            theBehaviour
          );
        });

        it('only accepts valid behaviours', async () => {
          await expect(
            Fmt.run(['--discardSurroundingText', 'not-valid', 'file.tf'])
          ).rejects.toThrow(
            'Expected --discardSurroundingText=not-valid to be one of: none, except-comments, except-comments-and-newlines, all'
          );
        });
      });
    });

    describe('--diff', () => {
      describe('when the flag is present', () => {
        it('prints a patch diff', async () => {
          printTFFileContentsSpy.mockReturnValue('local {\n myValue = 1\n}\n');

          await Fmt.run(['--diff', 'file.tf']);

          expect(logSpy.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                "[33m--- file.tf	removed[39m
            [33m+++ file.tf	added[39m
            [35m@@ -1,1 +1,3 @@[39m
            [31m-local { myValue=1 }[39m
            [32m+local {[39m
            [32m+ myValue = 1[39m
            [32m+}[39m
            ",
              ],
            ]
          `);
        });

        describe('when the output is the same', () => {
          it('prints no difference', async () => {
            vol.fromJSON({ 'file.tf': 'local { myValue=1 }\n' }, process.cwd());

            printTFFileContentsSpy.mockReturnValue('local { myValue=1 }\n');

            await Fmt.run(['--diff', 'file.tf']);

            expect(logSpy).toHaveBeenCalledWith('file.tf is already formatted');
          });
        });
      });
    });

    describe('--format', () => {
      let formatSpy = jest.spyOn(formatter, 'format');

      beforeEach(() => (formatSpy = jest.spyOn(formatter, 'format')));

      describe('when the flag is absent', () => {
        it('formats by default', async () => {
          await Fmt.run(['file.tf']);

          expect(formatSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe('when the flag is present', () => {
        it('calls format', async () => {
          await Fmt.run(['-F', 'file.tf']);

          expect(formatSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe('when negated with --no', () => {
        it('does not call format', async () => {
          await Fmt.run(['--no-format', 'file.tf']);

          expect(formatSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('--write', () => {
      describe('when the flag is absent', () => {
        it('does not write by default', async () => {
          const cwdAsJsonPreviously = cwdAsJson();

          await Fmt.run(['file.tf']);

          expect(printTFFileContentsSpy).toHaveBeenCalledTimes(1);
          expect(cwdAsJson()).toStrictEqual(cwdAsJsonPreviously);
        });
      });

      describe('when the flag is present', () => {
        it('writes the results to disk', async () => {
          const cwdAsJsonPreviously = cwdAsJson();

          await Fmt.run(['--write', 'file.tf']);

          expect(printTFFileContentsSpy).toHaveBeenCalledTimes(1);
          expect(cwdAsJson()).not.toStrictEqual(cwdAsJsonPreviously);
          expect(cwdAsJson()).toMatchInlineSnapshot(`
            Object {
              "file.tf": "hello world",
            }
          `);
        });
      });

      describe('when negated wth --no', () => {
        it('should not write', async () => {
          const cwdAsJsonPreviously = cwdAsJson();

          await Fmt.run(['-w', '--no-write', 'file.tf']);

          expect(printTFFileContentsSpy).toHaveBeenCalledTimes(1);
          expect(cwdAsJson()).toStrictEqual(cwdAsJsonPreviously);
        });
      });
    });
  });
});
