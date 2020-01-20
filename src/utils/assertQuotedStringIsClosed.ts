/**
 * Asserts that the given `str` has the appropriate closing quote,
 * if it starts with an opening string quote.
 */
export const assertQuotedStringIsClosed = (str: string): void => {
  const quote = str[0];

  if (
    (quote === "'" || quote === '"') &&
    (!str.endsWith(quote) || str.length === 1)
  ) {
    throw new Error(`missing closing ${quote} quote: "${str}"`);
  }
};
