import { parseTFFile, parseTFFileContents } from '@src/parsers';
import * as fs from 'fs';
import { mocked } from 'ts-jest/utils';

jest.mock('@src/parsers/parseTFFileContents');
jest.mock('fs');

const parseTFFileContentsMock = mocked(parseTFFileContents);

describe('parseFile', () => {
  const fileName = 'main.tf';
  const fileContents = '# my comment';

  let readFileSyncSpy = jest.spyOn(fs, 'readFileSync');

  beforeEach(() =>
    (readFileSyncSpy = jest.spyOn(fs, 'readFileSync')).mockReturnValue(
      fileContents
    )
  );

  it('reads the contents of the file', () => {
    parseTFFile(fileName);

    expect(readFileSyncSpy).toHaveBeenCalledWith(fileName);
  });

  it('passes the contents to parseTFFileContents', () => {
    parseTFFile(fileName);

    expect(parseTFFileContentsMock).toHaveBeenCalledWith(fileContents);
  });
});
