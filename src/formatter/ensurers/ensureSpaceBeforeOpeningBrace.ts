import {
  Ensurer,
  NodeWithOuterText,
  TokenType,
  ensureTextStartsWithTokens,
  walkNodes
} from '@src/formatter';

export const ensureSpaceBeforeOpeningBrace: Ensurer = blocks => {
  const formatLeadingOuterText = (node: NodeWithOuterText): void => {
    node.surroundingText.leadingOuterText = ensureTextStartsWithTokens(
      node.surroundingText.leadingOuterText,
      [{ type: TokenType.Whitespace, content: ' ' }]
    );
  };

  return walkNodes(blocks, {
    Body: formatLeadingOuterText,
    Map: formatLeadingOuterText
  });
};
