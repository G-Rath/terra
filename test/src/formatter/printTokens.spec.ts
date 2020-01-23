import { TokenType, printTokens } from '@src/formatter';

describe('printTokens', () => {
  describe('when there are no tokens', () => {
    it('prints an empty string', () => {
      expect(printTokens([])).toBe('');
    });
  });

  describe('when printing a comment token', () => {
    it('prints the tokens contents', () => {
      expect(
        printTokens([
          {
            type: TokenType.Comment,
            content: '/* hello world */'
          }
        ])
      ).toBe('/* hello world */');
    });

    it('does not add a newline', () => {
      expect(
        printTokens([
          {
            type: TokenType.Comment,
            content: '// hello world'
          }
        ])
      ).toBe('// hello world');
    });
  });

  describe('when printing a whitespace token', () => {
    it('prints the tokens contents', () => {
      expect(
        printTokens([
          {
            type: TokenType.Whitespace,
            content: ' '
          }
        ])
      ).toBe(' ');
    });
  });

  describe('when printing a newline token', () => {
    it('prints a newline', () => {
      expect(
        printTokens([
          {
            type: TokenType.Newline
          }
        ])
      ).toBe('\n');
    });
  });

  describe('when the token type is unknown', () => {
    it('throws', () => {
      expect(() =>
        printTokens([
          {
            type: 'unknown' as TokenType,
            content: ''
          }
        ])
      ).toThrow(/unknown token type/iu);
    });
  });
});
