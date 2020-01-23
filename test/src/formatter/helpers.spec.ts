import {
  TokenType,
  ensureTextEndsWithTokens,
  ensureTextStartsWithTokens
} from '@src/formatter';

describe('ensureTextEndsWithTokensTokens', () => {
  describe('when text is empty', () => {
    it('returns the tokens as text', () => {
      expect(ensureTextEndsWithTokens('', [{ type: TokenType.Newline }])).toBe(
        '\n'
      );
    });
  });

  describe('when the text already ends with the tokens', () => {
    it('does not change the text', () => {
      expect(
        ensureTextEndsWithTokens('// hello world\n', [
          { type: TokenType.Newline }
        ])
      ).toBe('// hello world\n');
    });
  });

  describe('when the text does not end with the tokens', () => {
    it('adds the tokens to the end of the text', () => {
      expect(
        ensureTextEndsWithTokens('// hello world', [
          { type: TokenType.Newline }
        ])
      ).toBe('// hello world\n');
    });

    describe('when there are more tokens than text', () => {
      it('adds the tokens to the end of the text', () => {
        expect(
          ensureTextEndsWithTokens('// hello world\n', [
            { type: TokenType.Comment, content: '// hello world' },
            { type: TokenType.Newline },
            { type: TokenType.Comment, content: '// hello sunshine' },
            { type: TokenType.Newline }
          ])
        ).toBe('// hello world\n// hello world\n// hello sunshine\n');
      });
    });
  });

  describe('when the tokens have content', () => {
    it('compares the content', () => {
      expect(
        ensureTextEndsWithTokens('// hello world', [
          { type: TokenType.Comment, content: '// hello world' }
        ])
      ).toBe('// hello world');
    });
  });
});

describe('ensureTextStartsWithTokens', () => {
  describe('when text is empty', () => {
    it('returns the tokens as text', () => {
      expect(
        ensureTextStartsWithTokens('', [{ type: TokenType.Newline }])
      ).toBe('\n');
    });
  });

  describe('when the text already starts with the tokens', () => {
    it('does not change the text', () => {
      expect(
        ensureTextStartsWithTokens('\n// hello world', [
          { type: TokenType.Newline }
        ])
      ).toBe('\n// hello world');
    });
  });

  describe('when the text does not start with the tokens', () => {
    it('adds the tokens to the start of the text', () => {
      expect(
        ensureTextStartsWithTokens('// hello world', [
          { type: TokenType.Newline }
        ])
      ).toBe('\n// hello world');
    });

    describe('when there are more tokens than text', () => {
      it('adds the tokens to the start of the text', () => {
        expect(
          ensureTextStartsWithTokens('// hello world\n', [
            { type: TokenType.Comment, content: '// hello world' },
            { type: TokenType.Newline },
            { type: TokenType.Comment, content: '// hello sunshine' },
            { type: TokenType.Newline }
          ])
        ).toBe('// hello world\n// hello sunshine\n// hello world\n');
      });
    });
  });

  describe('when the tokens have content', () => {
    it('compares the content', () => {
      expect(
        ensureTextStartsWithTokens('// hello world', [
          { type: TokenType.Comment, content: '// hello world' }
        ])
      ).toBe('// hello world');
    });
  });
});
