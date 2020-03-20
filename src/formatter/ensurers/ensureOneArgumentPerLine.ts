import {
  Ensurer,
  NodeWithOuterText,
  TokenType,
  callWithProp,
  parseSurroundingText,
  printTokens,
  walkNodes
} from '@src/formatter';

export const ensureOneArgumentPerLine: Ensurer = blocks => {
  const ensureNodeSurroundingTextHasNewline = ({
    surroundingText
  }: NodeWithOuterText): void => {
    const parsedText = parseSurroundingText(surroundingText.leadingOuterText);
    const firstCommentTokenIndex = parsedText.findIndex(
      token => token.type === TokenType.Comment
    );

    parsedText.splice(firstCommentTokenIndex, 0, { type: TokenType.Newline });

    surroundingText.leadingOuterText = printTokens(parsedText);
  };

  return walkNodes(blocks, {
    Attribute: callWithProp('key', ensureNodeSurroundingTextHasNewline),
    Argument: callWithProp('identifier', ensureNodeSurroundingTextHasNewline),
    Block: ensureNodeSurroundingTextHasNewline
  });
};
