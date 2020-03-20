import {
  Ensurer,
  TokenType,
  parseSurroundingText,
  printTokens,
  walkNodes
} from '@src/formatter';

export const ensureNoSpacesAfterFunctionName: Ensurer = blocks =>
  walkNodes(blocks, {
    Function: ({ name, surroundingText }) => {
      surroundingText.leadingOuterText = surroundingText.leadingOuterText.trim();
      name.surroundingText.trailingOuterText = name.surroundingText.trailingOuterText.trim();

      if (surroundingText.leadingOuterText.length) {
        const parsedText = parseSurroundingText(
          surroundingText.leadingOuterText
        );

        const lastToken = parsedText[parsedText.length - 1];

        if (
          lastToken.type !== TokenType.Comment ||
          lastToken.content.startsWith('/*')
        ) {
          return;
        }

        surroundingText.leadingOuterText = printTokens(
          parsedText.concat({ type: TokenType.Newline })
        );
      }
    }
  });
