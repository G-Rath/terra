/**
 * Converts the given `str` to a `Resource` name, by normalising it.
 *
 * - Dots are replaced with underscores
 * - `*` & `\052` are replaced with `_wild_`
 * - Strings starting with numbers are prefixed with an underscore
 *
 * @param {string} str
 *
 * @return {string}
 */
export const asResourceName = (str: string): string =>
  str
    .replace(/\./gu, '_')
    .replace(/\*/gu, '_wild_')
    .replace(/\\052/gu, '_wild_')
    .replace(/^(\d)/u, '_n_$1');
