import {
  CommentToken,
  NewlineToken,
  TokenType,
  WhitespaceToken,
  parseSurroundingText
} from '@src/formatter';

describe('parseSurroundingText', () => {
  describe('when the text is empty', () => {
    it('parses nothing', () => {
      expect(parseSurroundingText('')).toHaveLength(0);
    });
  });

  it('parses newlines', () => {
    const parsedTokens = parseSurroundingText('\n');

    expect(parsedTokens).toHaveLength(1);
    expect(parsedTokens).toContainEqual<NewlineToken>({
      type: TokenType.Newline
    });
  });

  it('parses # comments', () => {
    const parsedTokens = parseSurroundingText('# hello world');

    expect(parsedTokens).toHaveLength(1);
    expect(parsedTokens).toContainEqual<CommentToken>({
      type: TokenType.Comment,
      content: '# hello world'
    });
  });

  it('parses // comments', () => {
    const parsedTokens = parseSurroundingText('// hello world');

    expect(parsedTokens).toHaveLength(1);
    expect(parsedTokens).toContainEqual<CommentToken>({
      type: TokenType.Comment,
      content: '// hello world'
    });
  });

  it('parses multi-line comments', () => {
    const parsedTokens = parseSurroundingText('/* hello\nworld */');

    expect(parsedTokens).toHaveLength(1);
    expect(parsedTokens).toContainEqual<CommentToken>({
      type: TokenType.Comment,
      content: '/* hello\nworld */'
    });
  });

  it('parses newlines separately from comments', () => {
    const parsedTokens = parseSurroundingText('// hello world\n');

    expect(parsedTokens).toHaveLength(2);
    expect(parsedTokens[0]).toStrictEqual<CommentToken>({
      type: TokenType.Comment,
      content: '// hello world'
    });
    expect(parsedTokens[1]).toStrictEqual<NewlineToken>({
      type: TokenType.Newline
    });
  });

  it('parses spaces as whitespace', () => {
    const parsedTokens = parseSurroundingText(' ');

    expect(parsedTokens).toHaveLength(1);
    expect(parsedTokens[0]).toStrictEqual<WhitespaceToken>({
      type: TokenType.Whitespace,
      content: ' '
    });
  });

  describe('when text contains an unexpected char', () => {
    it('throws', () => {
      expect(() => parseSurroundingText('1')).toThrow(/unknown token "1"/iu);
    });
  });
});
