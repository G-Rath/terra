import {
  Ensurer,
  TokenType,
  mutateProp,
  parseSurroundingText,
  printTokens,
  walkNodes
} from '@src/formatter';

export const ensureNoSpacesAfterFunctionName: Ensurer = blocks =>
  walkNodes(blocks, {
    Function: ({ name, surroundingText }) => {
      mutateProp(surroundingText, 'leadingOuterText', tx => tx.trim());
      mutateProp(name.surroundingText, 'trailingOuterText', tx => tx.trim());

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
