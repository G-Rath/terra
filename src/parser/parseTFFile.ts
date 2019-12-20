import { parseTFFileContents } from '@src/parser';
import * as fs from 'fs';

export const parseTFFile = (filePath: string, record = false) => {
  const fileContents = fs.readFileSync(filePath).toString();

  return parseTFFileContents(fileContents, record);
};
