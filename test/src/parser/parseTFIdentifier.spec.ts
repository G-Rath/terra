import { parseTFIdentifier, StringCursor } from '@src/parser';

describe('parseTFIdentifier', () => {
  describe('leading text', () => {
    it('collects basic leading text correctly', () => {
      expect(parseTFIdentifier(new StringCursor('  hello '))).toBe('hello');
    });

    it('handles complex leading text correctly', () => {
      expect(
        parseTFIdentifier(new StringCursor('/* hello */ /* world */sunshine '))
      ).toBe('sunshine');
    });

    it('does not treat comments in leading text as the start of the identifier', () => {
      expect(
        parseTFIdentifier(new StringCursor('/* hello *//*again*/world '))
      ).toBe('world');
    });
  });

  describe('identifier text', () => {
    it('terminates on space', () => {
      expect(parseTFIdentifier(new StringCursor('hello '))).toBe('hello');
    });

    it('terminates on newline', () => {
      expect(parseTFIdentifier(new StringCursor('hello\n'))).toBe('hello');
    });

    it('terminates on opening multi-line comment', () => {
      expect(parseTFIdentifier(new StringCursor('hello/*'))).toBe('hello');
    });

    describe('when terminating', () => {
      it('rewinds the cursor 1 for spaces', () => {
        const cursor = new StringCursor('hello ');

        parseTFIdentifier(cursor);

        expect(cursor.position).toBe('hello '.length - 1);
      });

      it('rewinds the cursor 2 for multi-line comments', () => {
        const cursor = new StringCursor('hello/*');

        parseTFIdentifier(cursor);

        expect(cursor.position).toBe('hello/*'.length - 2);
      });
    });
  });
});
