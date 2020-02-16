import { TFFileContents } from '@src/types';

export type DiscardSurroundingTextBehaviour =
  | 'except-comments'
  | 'except-comments-and-newlines'
  | 'all';

/**
 * Discards the surrounding text of the given `contents`, based on the specified behaviour:
 *
 *  * `all`: all surrounding text will be discarded
 *  * `except-comments`: only surrounding text containing comments will be kept
 *  * `except-comments-and-newlines`: only surrounding text containing either at
 *                                    least one newline, or a comment will be kept
 *
 * @param {TFFileContents} contents
 * @param {DiscardSurroundingTextBehaviour} discardBehaviour
 *
 * @return {TFFileContents}
 */
export const discardSurroundingText = (
  contents: TFFileContents,
  discardBehaviour: DiscardSurroundingTextBehaviour
): TFFileContents =>
  JSON.parse(
    JSON.stringify(contents, (key, value) => {
      if (key !== 'surroundingText') {
        return value;
      }

      const surroundingText: Record<string, string> = { ...value };

      Object.keys(value).forEach(k => {
        surroundingText[k] = '';

        if (discardBehaviour !== 'all') {
          const text: string = value[k];

          if (/#|\*\/|\/\*|\/\//u.test(text)) {
            surroundingText[k] = text;
          }

          if (discardBehaviour === 'except-comments-and-newlines') {
            if (text.includes('\n')) {
              surroundingText[k] = text;
            }
          }
        }
      });

      return surroundingText;
    })
  );
