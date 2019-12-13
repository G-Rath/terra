import { printBlockBody } from '@src/printers';
import { TFBlockLiteral } from '@src/types';

/**
 * Prints the given `blockLiteral`
 *
 * @param {TFBlockLiteral} blockLiteral
 *
 * @return {string}
 */
export const printBlockLiteral = (blockLiteral: TFBlockLiteral): string =>
  [blockLiteral.name, printBlockBody(blockLiteral.body.body)].join(' ');
