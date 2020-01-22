import { StringCursor } from '@src/parser';

export enum TokenType {
  Whitespace = 'whitespace',
  Newline = 'newline',
  Comment = 'comment'
}

export interface WhitespaceToken {
  type: TokenType.Whitespace;
  content: string;
}

export interface NewlineToken {
  type: TokenType.Newline;
}

export interface CommentToken {
  type: TokenType.Comment;
  content: string;
}

export type Token = WhitespaceToken | NewlineToken | CommentToken;

const parseComment = (cursor: StringCursor): string => {
  const multiLineComment = cursor.char === '/' && cursor.peek() === '*';
  let comment = '';

  do {
    comment += cursor.advance();
  } while (
    !(cursor.isAtEnd() || comment.endsWith(multiLineComment ? '*/' : '\n'))
  );

  if (!multiLineComment && comment.endsWith('\n')) {
    comment = comment.slice(0, -1);
    cursor.rewind(1);
  }

  return comment;
};

const buildToken = (cursor: StringCursor): Token => {
  const char = cursor.advance();

  switch (char) {
    case '\n':
      return { type: TokenType.Newline };
    case ' ':
      return {
        type: TokenType.Whitespace,
        content: char
      };
    case '#':
    case '/':
      cursor.rewind(1);

      return {
        type: TokenType.Comment,
        content: parseComment(cursor)
      };
    default:
      throw new Error(`unknown token "${char}"`);
  }
};

export const parseSurroundingText = (text: string): Token[] => {
  const cursor = new StringCursor(text);
  const tokens: Token[] = [];

  while (!cursor.isAtEnd()) {
    tokens.push(buildToken(cursor));
  }

  return tokens;
};
