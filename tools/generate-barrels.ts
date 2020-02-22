#!/usr/bin/env ts-node
/* eslint-disable no-sync */

import * as fs from 'fs';
import * as path from 'path';

const ensureEndsWithNewline = (str: string): string => `${str.trim()}\n`;

const generateBarrel = (directory: string): boolean => {
  const files = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter(file => {
      if (file.isDirectory()) {
        return generateBarrel(path.join(directory, file.name));
      }

      return file.name !== 'index.ts' && file.name.endsWith('.ts');
    })
    .map(f => f.name);

  if (files.length) {
    fs.writeFileSync(
      path.join(directory, 'index.ts'),
      ensureEndsWithNewline(
        files
          .map(file => `export * from './${path.parse(file).name}';`)
          .sort((a, b) => b.length - a.length)
          .join('\n')
      )
    );
    console.log(' ', path.relative('.', directory));

    return true;
  }

  return false;
};

console.log('writing barrels for:');

fs.readdirSync(path.join(process.cwd(), 'src'), { withFileTypes: true })
  .filter(f => f.isDirectory())
  .forEach(f => generateBarrel(path.join(process.cwd(), 'src', f.name)));

console.log('done');
