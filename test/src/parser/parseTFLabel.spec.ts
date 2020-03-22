import { makeTFLabel } from '@src/makers';
import { StringCursor, parseTFLabel } from '@src/parser';
import type { TFLabel } from '@src/types';

describe('parseTFLabel', () => {
  describe('leading outer text', () => {
    it('collects basic leading text', () => {
      const { leadingOuterText } = parseTFLabel(
        new StringCursor(' hello ')
      ).surroundingText;

      expect(leadingOuterText).toBe(' ');
    });

    it('collects leading comments', () => {
      const { leadingOuterText } = parseTFLabel(
        new StringCursor(' /* hello */ world ')
      ).surroundingText;

      expect(leadingOuterText).toBe(' /* hello */ ');
    });
  });

  describe('label text', () => {
    describe('when label is unquoted', () => {
      it('terminates on space', () => {
        const label = parseTFLabel(new StringCursor('hello '));

        expect(label).toStrictEqual<TFLabel>(makeTFLabel('hello'));
      });

      it('terminates on opening brace', () => {
        const label = parseTFLabel(new StringCursor('hello{'));

        expect(label).toStrictEqual<TFLabel>(makeTFLabel('hello'));
      });

      it('terminates on opening square bracket', () => {
        const label = parseTFLabel(new StringCursor('hello['));

        expect(label).toStrictEqual<TFLabel>(makeTFLabel('hello'));
      });

      it('terminates on newline', () => {
        const label = parseTFLabel(new StringCursor('hello\n'));

        expect(label).toStrictEqual<TFLabel>(makeTFLabel('hello'));
      });

      it('terminates on opening multi-line comment', () => {
        const label = parseTFLabel(new StringCursor('hello/*'));

        expect(label).toStrictEqual<TFLabel>(makeTFLabel('hello'));
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
        const label = parseTFLabel(new StringCursor('"hello"'));

        expect(label).toStrictEqual<TFLabel>(makeTFLabel('"hello"'));
      });

      it('does not terminate on spaces', () => {
        const label = parseTFLabel(new StringCursor('"hello world"'));

        expect(label).toStrictEqual<TFLabel>(makeTFLabel('"hello world"'));
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
