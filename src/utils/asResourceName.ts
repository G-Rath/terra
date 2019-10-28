/**
 * Converts the given `str` to a `Resource` name, by normalising it.
 *
 * - Dots are replaced with underscores
 * - `*` are replaced with `_wild_`
 * - Strings starting with numbers are prefixed with an underscore
 *
 * @param {string} str
 *
 * @return {string}
 */
export const asResourceName = (str: string): string =>
  str
    .replace(/\./g, '_')
    .replace(/\*/g, '_wild_')
    .replace(/^(\d)/, '_n_$1');
