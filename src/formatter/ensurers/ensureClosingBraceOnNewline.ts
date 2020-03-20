import {
  Ensurer,
  TokenType,
  ensureTextStartsWithTokens,
  mutateProp,
  parseSurroundingText,
  printTokens,
  walkNodes
} from '@src/formatter';

export const ensureClosingBraceOnNewline: Ensurer = blocks => {
  return walkNodes(blocks, {
    Body: node => {
      mutateProp(node.surroundingText, 'trailingInnerText', text =>
        ensureTextStartsWithTokens(text, [{ type: TokenType.Newline }])
      );
    },
    Map: (node): void => {
      if (node.surroundingText.trailingInnerText.includes('\n')) {
        return;
      }

      const parsedText = parseSurroundingText(
        node.surroundingText.trailingInnerText
      );

      parsedText.splice(
        parsedText.findIndex(token => token.type === TokenType.Comma) + 1,
        0,
        { type: TokenType.Newline }
      );

      node.surroundingText.trailingInnerText = printTokens(parsedText);
    }
  });
};
