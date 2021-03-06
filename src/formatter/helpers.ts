import {
  Token,
  ensureClosingBraceOnNewline,
  ensureIndentation,
  ensureLabelsHaveLeadingSpace,
  ensureNoSpacesAfterFunctionName,
  ensureSpaceBeforeOpeningBrace,
  ensureTopLevelBlocksAreSeparated,
  parseSurroundingText,
  printTokens
} from '@src/formatter';
import type {
  SurroundingInnerText,
  SurroundingOuterText,
  TFBlock
} from '@src/types';

export interface NodeWithOuterText {
  surroundingText: SurroundingOuterText;
}

export interface NodeWithInnerText {
  surroundingText: SurroundingInnerText;
}

export type Ensurer = (blocks: TFBlock[]) => TFBlock[];

export const ensurers: readonly Ensurer[] = Object.freeze([
  ensureTopLevelBlocksAreSeparated,
  ensureNoSpacesAfterFunctionName,
  ensureSpaceBeforeOpeningBrace,
  ensureLabelsHaveLeadingSpace,
  ensureClosingBraceOnNewline,
  ensureIndentation
]);

/**
 * Returns a function that calls the given `fn` with the value of
 * the given `prop` on the `obj` passed as the first argument.
 *
 * @param {TProp} prop
 * @param {(value: TObj[TProp]) => void} fn
 *
 * @return {(obj: TObj) => void}
 *
 * @template TObj, TProp
 */
export const callWithProp = <TObj extends object, TProp extends keyof TObj>(
  prop: TProp,
  fn: (value: TObj[TProp]) => void
) => (obj: TObj): void => fn(obj[prop]);

/**
 * Mutates the specified `prop` on the given `obj`, by assigning the value
 * returned when calling the given `callback` with the current value of the prop.
 *
 * @param {TObj} obj
 * @param {TKey} key
 * @param {(value: TObj[TKey]) => TObj[TKey]} callback
 *
 * @template TObj, TKey
 */
export const mutateProp = <TObj extends object, TKey extends keyof TObj>(
  obj: TObj,
  key: TKey,
  callback: (value: TObj[TKey]) => TObj[TKey]
): void => {
  // eslint-disable-next-line node/callback-return
  obj[key] = callback(obj[key]);
};

/**
 * Compares the given `Token`s to see if they are equal.
 *
 * A `Token` is equal to another if both `Token`s have the same type & content.
 *
 * @param {Token & {content?: any}} a
 * @param {Token & {content?: any}} b
 *
 * @returns {boolean}
 */
const areTokensEqual = (
  a: Token & { content?: unknown },
  b: Token & { content?: unknown }
): boolean => a.type === b.type && a.content === b.content;

/**
 * Ensures that the given array of `tokens` ends with the second given array of `Token`s.
 *
 * This compares in the same manner as `String#endsWith`.
 *
 * @param {readonly Token[]} tokens
 * @param {readonly Token[]} tokensToEndWith
 *
 * @returns {readonly Token[]}
 */
const ensureTokensEndWithTokens = (
  tokens: readonly Token[],
  tokensToEndWith: readonly Token[]
): readonly Token[] => {
  if (tokens.length === 0) {
    return tokensToEndWith;
  }

  if (
    tokensToEndWith.length <= tokens.length &&
    tokensToEndWith.every((token, i) =>
      areTokensEqual(token, tokens[tokens.length - i - 1])
    )
  ) {
    return tokens;
  }

  return tokens.concat(tokensToEndWith);
};

export const ensureTextEndsWithTokens = (
  text: string,
  tokens: readonly Token[]
): string =>
  printTokens(ensureTokensEndWithTokens(parseSurroundingText(text), tokens));

/**
 * Ensures that the given array of `tokens` starts with the second given array of `Token`s.
 *
 * This compares in the same manner as `String#startsWith`.
 *
 * @param {readonly Token[]} tokens
 * @param {readonly Token[]} tokensToStartWith
 *
 * @returns {readonly Token[]}
 */
const ensureTokensStartWithTokens = (
  tokens: readonly Token[],
  tokensToStartWith: readonly Token[]
): readonly Token[] => {
  if (tokens.length === 0) {
    return tokensToStartWith;
  }

  if (
    tokensToStartWith.length <= tokens.length &&
    tokensToStartWith.every((token, i) => areTokensEqual(token, tokens[i]))
  ) {
    return tokens;
  }

  return tokensToStartWith.concat(tokens);
};

export const ensureTextStartsWithTokens = (
  text: string,
  tokens: readonly Token[]
): string =>
  printTokens(ensureTokensStartWithTokens(parseSurroundingText(text), tokens));
