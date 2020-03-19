import {
  TFNodeListenerPair,
  Token,
  TokenType,
  ensureTextStartsWithTokens,
  parseSurroundingText,
  printTokens,
  walkNodes
} from '@src/formatter';
import {
  SurroundingInnerText,
  SurroundingOuterText,
  TFBlock,
  TFBlockBody,
  TFFunctionCall,
  TFListExpression,
  TFLiteralExpression,
  TFMapExpression,
  TFNodeType
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
    Attribute: node => ensureNodeSurroundingTextHasNewline(node.key),
    Argument: node => ensureNodeSurroundingTextHasNewline(node.identifier),
    Block: ensureNodeSurroundingTextHasNewline
  });
};

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

export const ensureIndentation: Ensurer = blocks => {
  const indentAmount = 2;
  let depth = 0;

  const increaseDepthByOne = (): unknown => (depth += 1);
  const decreaseDepthByOne = (): unknown => (depth -= 1);

  const indentText = (text: string, indentLevel: number = depth): string => {
    const parsedText = parseSurroundingText(text);
    const rebuiltTextTokens: Token[] = [];
    const desiredWhitespaceCount = indentLevel * indentAmount;
    let currentWhitespaceCount = 0;

    // force TS to see this as a boolean instead of just "false"
    let foundNewline = false as boolean;

    parsedText.forEach(token => {
      // if we're handling indenting after a newline
      if (foundNewline) {
        if (token.type === TokenType.Whitespace) {
          // if we have more whitespace tokens than we want, drop the token
          if (currentWhitespaceCount >= desiredWhitespaceCount) {
            return;
          }

          currentWhitespaceCount += 1;
          rebuiltTextTokens.unshift(token);

          return;
        }

        // if the token is a comment, ensure we're at the correct indent level
        // then add it to the stack
        if (token.type === TokenType.Comment) {
          while (currentWhitespaceCount < desiredWhitespaceCount) {
            rebuiltTextTokens.unshift({
              type: TokenType.Whitespace,
              content: ' '
            });

            currentWhitespaceCount += 1;
          }

          currentWhitespaceCount = 0;
          rebuiltTextTokens.unshift(token);
          foundNewline = false;

          return;
        }
      }

      if (token.type === TokenType.Newline) {
        foundNewline = true;
      }

      rebuiltTextTokens.unshift(token);
    });

    if (foundNewline || rebuiltTextTokens.length === 0) {
      while (currentWhitespaceCount < desiredWhitespaceCount) {
        rebuiltTextTokens.unshift({
          type: TokenType.Whitespace,
          content: ' '
        });

        currentWhitespaceCount += 1;
      }
    }

    return printTokens(rebuiltTextTokens.reverse());
  };

  const indentLeadingOuterText = (node: NodeWithOuterText): void => {
    node.surroundingText.leadingOuterText = indentText(
      node.surroundingText.leadingOuterText
    );
  };

  /**
   * Access the appropriate surrounding text of the given `expression`
   * that should be used to format the "outside" of the complete node.
   *
   * For all expression nodes except function calls,
   * this is the top-level `surroundingText` property.
   *
   * For function calls, this is the `surroundingText`
   * of the `Identifier` node assigned to `name`.
   *
   * @param {TFLiteralExpression} expression
   *
   * @return {TFLiteralExpression["surroundingText"]}
   */
  const accessSurroundingText = (
    expression: TFLiteralExpression
  ): TFLiteralExpression['surroundingText'] =>
    expression.type === TFNodeType.Function
      ? expression.name.surroundingText
      : expression.surroundingText;

  /**
   * Gets the expressions that should be indented from the given `node`,
   * based on if the expressions have a newline in their `leadingOuterText`.
   *
   * @param {TFFunctionCall | TFListExpression} node
   *
   * @return {TFLiteralExpression[]}
   */
  const getExpressionsToIndent = (
    node: TFFunctionCall | TFListExpression
  ): TFLiteralExpression[] =>
    (node.type === TFNodeType.Function ? node.args : node.values).filter(exp =>
      accessSurroundingText(exp).leadingOuterText.includes('\n')
    );

  /**
   * Chunks the given `text` into lines starting with a newline.
   *
   * @param {string} text
   *
   * @return {string[]}
   */
  const chunkTextByNewlines = (text: string): string[] => {
    const parsedText = parseSurroundingText(text);
    const lines: Token[][] = [];

    for (const token of parsedText) {
      if (lines.length === 0 || token.type === TokenType.Newline) {
        lines.push([]);
      }

      lines[lines.length - 1].push(token);
    }

    return lines.map(printTokens);
  };

  const indentTrailingInnerText = (
    node: TFFunctionCall | TFMapExpression | TFListExpression | TFBlockBody
  ): void => {
    if (node.surroundingText.trailingInnerText.length === 0) {
      return;
    }

    const lines = chunkTextByNewlines(
      node.surroundingText.trailingInnerText
    ).map(line => indentText(line, depth + 1));

    // dedent the last line at the current depth
    lines[lines.length - 1] = indentText(lines[lines.length - 1]);

    node.surroundingText.trailingInnerText = lines.join('');
  };

  const indentBlocksAndMaps: TFNodeListenerPair<
    TFBlockBody | TFMapExpression
  > = {
    enter: increaseDepthByOne,
    exit: node => {
      decreaseDepthByOne();

      indentTrailingInnerText(node);
    }
  };

  const indentFunctionsAndLists: TFNodeListenerPair<
    TFFunctionCall | TFListExpression
  > = {
    enter(node) {
      const expressionsToIndent = getExpressionsToIndent(node);

      const surroundingText = accessSurroundingText(node);

      if (surroundingText.leadingOuterText.includes('\n')) {
        surroundingText.leadingOuterText = indentText(
          surroundingText.leadingOuterText
        );
      }

      if (!expressionsToIndent.length) {
        return;
      }

      increaseDepthByOne();

      expressionsToIndent
        .map(exp => (exp.type === TFNodeType.Function ? exp.name : exp))
        .forEach(indentLeadingOuterText);
    },
    exit(node) {
      if (getExpressionsToIndent(node).length) {
        decreaseDepthByOne();
      }

      indentTrailingInnerText(node);
    }
  };

  return walkNodes(blocks, {
    Attribute: node => indentLeadingOuterText(node.key),
    Argument: node => indentLeadingOuterText(node.identifier),
    Block: indentLeadingOuterText,
    Function: indentFunctionsAndLists,
    List: indentFunctionsAndLists,
    Body: indentBlocksAndMaps,
    Map: indentBlocksAndMaps
  });
};

export const ensurers: readonly Ensurer[] = Object.freeze([
  ensureTopLevelBlocksAreSeparated,
  ensureNoSpacesAfterFunctionName,
  ensureSpaceBeforeOpeningBrace,
  ensureLabelsHaveLeadingSpace,
  ensureClosingBraceOnNewline,
  ensureOneArgumentPerLine,
  ensureIndentation
]);
