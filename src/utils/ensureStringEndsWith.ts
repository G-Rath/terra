/**
 * Ensures that the given `str` ends with the given `ending`
 *
 * @param {string} str
 * @param {string} ending
 *
 * @return {string}
 */
export const ensureStringEndsWith = (str: string, ending: string) =>
  str.endsWith(ending) ? str : `${str}${ending}`;
