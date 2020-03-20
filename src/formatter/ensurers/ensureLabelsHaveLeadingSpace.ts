import {
  Ensurer,
  TokenType,
  ensureTextStartsWithTokens,
  mutateProp,
  walkNodes
} from '@src/formatter';

export const ensureLabelsHaveLeadingSpace: Ensurer = blocks =>
  walkNodes(blocks, {
    Label: node => {
      mutateProp(node.surroundingText, 'leadingOuterText', text =>
        ensureTextStartsWithTokens(text, [
          { type: TokenType.Whitespace, content: ' ' }
        ])
      );
    }
  });
