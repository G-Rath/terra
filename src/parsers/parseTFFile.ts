import { parseTFFileContents } from '@src/parsers';
import * as fs from 'fs';

export const parseTFFile = (filePath: string) => {
  const fileContents = fs.readFileSync(filePath).toString();

  return parseTFFileContents(fileContents);
};
