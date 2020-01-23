import { Token, TokenType } from '@src/formatter';

export const printTokens = (tokens: readonly Token[]): string =>
  tokens
    .map(token => {
      switch (token.type) {
        case TokenType.Newline:
          return '\n';
        case TokenType.Comment:
        case TokenType.Whitespace:
          return token.content;
        default:
          throw new Error('unknown token type');
      }
    })
    .join('');
