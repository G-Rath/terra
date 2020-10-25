import {
  Ensurer,
  TokenType,
  ensureTextStartsWithTokens,
  mutateProp,
  parseSurroundingText,
  printTokens,
  walkNodes
} from '@src/formatter';
import { TFNodeType } from '@src/types';

export const ensureClosingBraceOnNewline: Ensurer = blocks =>
  walkNodes(blocks, {
    Body: node => {
      if (node.body.length) {
        const lastNode = node.body[node.body.length - 1];

        if (
          lastNode.type === TFNodeType.Argument &&
          lastNode.expression.type === TFNodeType.Heredoc
        ) {
          // heredocs always end with a newline in their outer text
          return;
        }
      }

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
