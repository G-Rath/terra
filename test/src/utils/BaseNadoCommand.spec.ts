import * as Parser from '@oclif/parser';
import * as formatter from '@src/formatter';
import { makeTFResourceBlock } from '@src/makers';
import * as printers from '@src/printer';
import { TFBlock } from '@src/types';
import { AwsResourceType, BaseNadoCommand, ParseResults } from '@src/utils';
import { cwdAsJson } from '@test/setupMockFs';

const nadoResourceMock = jest.fn<Promise<TFBlock[]>, [unknown]>();

class BaseNadoCommandImpl extends BaseNadoCommand {
  public static flags = BaseNadoCommand.flags;

  public static args: Parser.args.IArg[] = [
    { name: 'myArg', required: false } //
  ];

  protected _defaultFilenamePrefix = 'bucket';
  protected _primaryResourceBlockType = AwsResourceType.AWS_S3_BUCKET;

  protected async _nadoResource(
    args: Record<string, unknown>
  ): Promise<TFBlock[]> {
    return nadoResourceMock(args);
  }

  protected _parse(): ParseResults {
    return this.parse(BaseNadoCommandImpl);
  }
}

describe('BaseNadoCommand', () => {
  const mockPrintContents = 'hello world';
  let logSpy: jest.SpiedFunction<typeof BaseNadoCommandImpl.prototype.log>;
  let printTFFileContentsSpy: jest.SpiedFunction<typeof printers.printTFFileContents>;

  beforeEach(() => {
    nadoResourceMock.mockResolvedValue([
      makeTFResourceBlock(AwsResourceType.AWS_S3_BUCKET, 'mine', [])
    ]);

    logSpy = jest.spyOn(BaseNadoCommandImpl.prototype, 'log');
    printTFFileContentsSpy = jest
      .spyOn(printers, 'printTFFileContents')
      .mockReturnValue(mockPrintContents);
  });

  describe('flags', () => {
    describe('--format', () => {
      let formatSpy = jest.spyOn(formatter, 'format');

      beforeEach(() => (formatSpy = jest.spyOn(formatter, 'format')));

      describe('when the flag is absent', () => {
        it('formats by default', async () => {
          await BaseNadoCommandImpl.run([]);

          expect(formatSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe('when the flag is present', () => {
        it('calls format', async () => {
          await BaseNadoCommandImpl.run(['-F']);

          expect(formatSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe('when negated with --no', () => {
        it('does not call format', async () => {
          await BaseNadoCommandImpl.run(['--no-format']);

          expect(formatSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('--write', () => {
      describe('when the flag is absent', () => {
        it('does not write by default', async () => {
          const cwdAsJsonPreviously = cwdAsJson();

          await BaseNadoCommandImpl.run([]);

          expect(printTFFileContentsSpy).toHaveBeenCalledTimes(1);
          expect(cwdAsJson()).toStrictEqual(cwdAsJsonPreviously);
        });

        it('prints the output to the console', async () => {
          await BaseNadoCommandImpl.run([]);

          expect(printTFFileContentsSpy).toHaveBeenCalledTimes(1);
          console.log(printTFFileContentsSpy.mock.results[0].value);
          expect(logSpy).toHaveBeenCalledWith(
            printTFFileContentsSpy.mock.results[0].value
          );
        });
      });

      describe('when the flag is present', () => {
        it('writes the results to disk', async () => {
          const cwdAsJsonPreviously = cwdAsJson();

          await BaseNadoCommandImpl.run(['--write']);

          expect(printTFFileContentsSpy).toHaveBeenCalledTimes(1);
          expect(cwdAsJson()).not.toStrictEqual(cwdAsJsonPreviously);
          expect(cwdAsJson()).toMatchInlineSnapshot(`
            Object {
              "bucket_mine.tf": "hello world",
            }
          `);
        });

        it('prints the filename to the console', async () => {
          await BaseNadoCommandImpl.run(['--write']);

          expect(logSpy).toHaveBeenCalledWith(
            expect.stringMatching(/Written resources to bucket_mine/iu)
          );
        });
      });

      describe('when negated wth --no', () => {
        it('should not write', async () => {
          const cwdAsJsonPreviously = cwdAsJson();

          await BaseNadoCommandImpl.run(['-w', '--no-write']);

          expect(printTFFileContentsSpy).toHaveBeenCalledTimes(1);
          expect(cwdAsJson()).toStrictEqual(cwdAsJsonPreviously);
        });
      });
    });

    describe('--filename', () => {
      describe('when the flag is absent', () => {
        it('builds a default filename', async () => {
          const cwdAsJsonPreviously = cwdAsJson();

          await BaseNadoCommandImpl.run(['-w']);

          expect(printTFFileContentsSpy).toHaveBeenCalledTimes(1);
          expect(cwdAsJson()).not.toStrictEqual(cwdAsJsonPreviously);
          expect(cwdAsJson()).toHaveProperty(['bucket_mine.tf']);
        });

        describe('if the content somehow contains no blocks with the resource type', () => {
          beforeEach(() =>
            nadoResourceMock.mockResolvedValue([
              makeTFResourceBlock(AwsResourceType.AWS_IAM_USER, 'mine', [])
            ])
          );

          it('throws', async () => {
            await expect(BaseNadoCommandImpl.run(['-w'])).rejects.toThrow(
              /Cannot find block of type/iu
            );
          });
        });
      });

      describe('when the flag is present', () => {
        it('uses that name for the file', async () => {
          const cwdAsJsonPreviously = cwdAsJson();

          await BaseNadoCommandImpl.run(['-w', '-f', 'file.tf']);

          expect(printTFFileContentsSpy).toHaveBeenCalledTimes(1);
          expect(cwdAsJson()).not.toStrictEqual(cwdAsJsonPreviously);
          expect(cwdAsJson()).toHaveProperty(['file.tf'], 'hello world');
        });
      });
    });
  });

  describe('when there are no resources to generate content for', () => {
    beforeEach(() => nadoResourceMock.mockResolvedValue([]));

    it('should not write anything to disk', async () => {
      const cwdAsJsonPreviously = cwdAsJson();

      await BaseNadoCommandImpl.run(['-w']);

      expect(cwdAsJson()).toStrictEqual(cwdAsJsonPreviously);
    });
  });

  it('passes the args to _nadoResource', async () => {
    await BaseNadoCommandImpl.run(['hello world']);

    expect(nadoResourceMock).toHaveBeenCalledWith({ myArg: 'hello world' });
  });
});
