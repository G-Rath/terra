import { parseTFLabel, StringCursor } from '@src/parser';

describe('parseTFLabel', () => {
  describe('leading text', () => {
    it('collects basic leading text correctly', () => {
      expect(parseTFLabel(new StringCursor('  hello '))).toBe('hello');
    });

    it('handles complex leading text correctly', () => {
      expect(
        parseTFLabel(new StringCursor('/* hello */ /* world */sunshine '))
      ).toBe('sunshine');
    });

    it('does not treat comments in leading text as the start of the label', () => {
      expect(parseTFLabel(new StringCursor('/* hello *//*again*/world '))).toBe(
        'world'
      );
    });
  });

  describe('label text', () => {
    describe('when label is unquoted', () => {
      it('terminates on space', () => {
        expect(parseTFLabel(new StringCursor('hello '))).toBe('hello');
      });

      it('terminates on newline', () => {
        expect(parseTFLabel(new StringCursor('hello\n'))).toBe('hello');
      });

      it('terminates on opening multi-line comment', () => {
        expect(parseTFLabel(new StringCursor('hello/*'))).toBe('hello');
      });

      it('throws when ending with a quote', () => {
        expect(() => parseTFLabel(new StringCursor('hello" '))).toThrow(
          'missing opening " quote'
        );
      });

      describe('when terminating', () => {
        it('rewinds the cursor 1 for spaces', () => {
          const cursor = new StringCursor('hello ');

          parseTFLabel(cursor);

          expect(cursor.position).toBe('hello '.length - 1);
        });

        it('rewinds the cursor 2 for multi-line comments', () => {
          const cursor = new StringCursor('hello/*');

          parseTFLabel(cursor);

          expect(cursor.position).toBe('hello/*'.length - 2);
        });
      });
    });

    describe('when label is quoted', () => {
      it('terminates on closing quote', () => {
        expect(parseTFLabel(new StringCursor('"hello"'))).toBe('"hello"');
      });

      it('does not terminate on spaces', () => {
        expect(parseTFLabel(new StringCursor('"hello world"'))).toBe(
          '"hello world"'
        );
      });

      describe('when terminating', () => {
        it('does not rewind the cursor', () => {
          const cursor = new StringCursor('"hello world"');

          parseTFLabel(cursor);

          expect(cursor.position).toBe('"hello world"'.length);
        });
      });
    });
  });
});
