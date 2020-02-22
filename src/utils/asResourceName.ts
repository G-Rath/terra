/**
 * Converts the given `str` to a `Resource` name, by normalising it.
 *
 * - Dots are replaced with underscores
 * - `@`s are replaced with `_at_`
 * - `=`s are replaced with `_eq_`
 * - `+`s are replaced with `_plus_`
 * - `/`s are replaced with `_slash_`
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
    .replace(/@/gu, '_at_')
    .replace(/=/gu, '_eq_')
    .replace(/,/gu, '_comma_')
    .replace(/\+/gu, '_plus_')
    .replace(/\*/gu, '_wild_')
    .replace(/\//gu, '_slash_')
    .replace(/\\052/gu, '_wild_')
    .replace(/^(\d)/u, '_n_$1');
