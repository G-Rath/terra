import {
  Ensurer,
  NodeWithOuterText,
  TokenType,
  ensureTextStartsWithTokens,
  mutateProp,
  walkNodes
} from '@src/formatter';

export const ensureSpaceBeforeOpeningBrace: Ensurer = blocks => {
  const formatLeadingOuterText = (node: NodeWithOuterText): void => {
    mutateProp(node.surroundingText, 'leadingOuterText', text =>
      ensureTextStartsWithTokens(text, [
        { type: TokenType.Whitespace, content: ' ' }
      ])
    );
  };

  return walkNodes(blocks, {
    Body: formatLeadingOuterText,
    Map: formatLeadingOuterText
  });
};
