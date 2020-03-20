import {
  Ensurer,
  TokenType,
  ensureTextStartsWithTokens,
  walkNodes
} from '@src/formatter';

export const ensureLabelsHaveLeadingSpace: Ensurer = blocks =>
  walkNodes(blocks, {
    Label: node => {
      node.surroundingText.leadingOuterText = ensureTextStartsWithTokens(
        node.surroundingText.leadingOuterText,
        [{ type: TokenType.Whitespace, content: ' ' }]
      );
    }
  });
