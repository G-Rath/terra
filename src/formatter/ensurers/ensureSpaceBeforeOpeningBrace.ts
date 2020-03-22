import {
  Ensurer,
  NodeWithOuterText,
  TokenType,
  ensureTextStartsWithTokens,
  mutateProp,
  walkNodes
} from '@src/formatter';

const formatLeadingOuterText = (node: NodeWithOuterText): void => {
  mutateProp(node.surroundingText, 'leadingOuterText', text =>
    ensureTextStartsWithTokens(text, [
      { type: TokenType.Whitespace, content: ' ' }
    ])
  );
};

export const ensureSpaceBeforeOpeningBrace: Ensurer = blocks =>
  walkNodes(blocks, {
    Body: formatLeadingOuterText,
    Map: formatLeadingOuterText
  });
