import {
  TokenType,
  ensureTextStartsWithTokens,
  parseSurroundingText,
  printTokens,
  walkNodes
} from '@src/formatter';
import {
  SurroundingInnerText,
  SurroundingOuterText,
  TFBlock
} from '@src/types';

interface NodeWithOuterText {
  surroundingText: SurroundingOuterText;
}

interface NodeWithInnerText {
  surroundingText: SurroundingInnerText;
}

export type Ensurer = (blocks: TFBlock[]) => TFBlock[];

export const ensureTopLevelBlocksAreSeparated: Ensurer = blocks => {
  if (blocks.length <= 1) {
    return blocks;
  }

  return [
    blocks[0],
    ...blocks.slice(1).map(block => {
      const { leadingOuterText } = block.surroundingText;

      const parsedText = parseSurroundingText(leadingOuterText);

      const firstNewlineTokenIndex = parsedText.findIndex(
        token => token.type === TokenType.Newline
      );

      if (firstNewlineTokenIndex === -1) {
        parsedText.splice(
          firstNewlineTokenIndex,
          0,
          { type: TokenType.Newline },
          { type: TokenType.Newline }
        );
      } else if (
        parsedText.length <= firstNewlineTokenIndex + 1 ||
        parsedText[firstNewlineTokenIndex + 1].type !== TokenType.Newline
      ) {
        parsedText.splice(firstNewlineTokenIndex, 0, {
          type: TokenType.Newline
        });
      }

      return {
        ...block,
        surroundingText: {
          ...block.surroundingText,
          leadingOuterText: printTokens(parsedText)
        }
      };
    })
  ];
};

export const ensureLabelsHaveLeadingSpace: Ensurer = blocks =>
  walkNodes(blocks, {
    Label: node => {
      node.surroundingText.leadingOuterText = ensureTextStartsWithTokens(
        node.surroundingText.leadingOuterText,
        [{ type: TokenType.Whitespace, content: ' ' }]
      );
    }
  });

export const ensureClosingBraceOnNewline: Ensurer = blocks => {
  return walkNodes(blocks, {
    Body: (node): void => {
      node.surroundingText.trailingInnerText = ensureTextStartsWithTokens(
        node.surroundingText.trailingInnerText,
        [{ type: TokenType.Newline }]
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

export const ensurers: readonly Ensurer[] = Object.freeze([
  ensureTopLevelBlocksAreSeparated,
  ensureNoSpacesAfterFunctionName,
  ensureSpaceBeforeOpeningBrace,
  ensureLabelsHaveLeadingSpace,
  ensureClosingBraceOnNewline
]);
