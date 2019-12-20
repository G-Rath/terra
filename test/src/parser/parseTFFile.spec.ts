import * as parser from '@src/parser';
import { parseTFFile } from '@src/parser';
import { TFFileContents } from '@src/types';
import * as fs from 'fs';
import { mocked } from 'ts-jest/utils';

jest.mock('fs');
const fsMock = mocked(fs);

describe('parseTFFileContents', () => {
  beforeEach(() => fsMock.readFileSync.mockReturnValue(''));

  it('reads the file from disk', () => {
    const filePath = '';

    parseTFFile(filePath);

    expect(fsMock.readFileSync).toHaveBeenCalledWith(filePath);
  });

  it('passes the file contents to parseTFFileContents', () => {
    const parseTFFileContentsSpy = jest
      .spyOn(parser, 'parseTFFileContents')
      .mockReturnValue({
        blocks: [],
        surroundingText: {
          leadingOuterText: '',
          trailingOuterText: ''
        }
      });

    expect(parseTFFile('file', true)).toStrictEqual<TFFileContents>({
      blocks: [],
      surroundingText: {
        leadingOuterText: '',
        trailingOuterText: ''
      }
    });

    expect(parseTFFileContentsSpy).toHaveBeenCalledWith(
      expect.any(String),
      true
    );
  });
});
