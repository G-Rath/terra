/* eslint-disable jest/require-top-level-describe, no-sync, @typescript-eslint/no-explicit-any */

import * as fs from 'fs';
import { createFsFromVolume, vol } from 'memfs';
import { ufs } from 'unionfs';

/**
 * Factory that provides the real file-system union-d with an in-memory one.
 *
 * Files that don't exist in the in-memory FS will be read from the underlying
 * real file system, while any writes will take place on the in-memory FS.
 *
 * @return {typeof fs}
 */
const mockFsFactory = (): typeof fs => {
  beforeEach(() => vol.mkdirSync(process.cwd(), { recursive: true }));
  afterEach(() => vol.reset());

  return ufs
    .use(jest.requireActual('fs'))
    .use(createFsFromVolume(vol) as any) as any;
};

export = mockFsFactory;
