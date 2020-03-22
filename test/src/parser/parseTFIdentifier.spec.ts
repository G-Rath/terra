import { makeTFIdentifier } from '@src/makers';
import { StringCursor, parseTFIdentifier } from '@src/parser';
import type { TFIdentifier } from '@src/types';

describe('parseTFIdentifier', () => {
  describe('leading outer text', () => {
    it('collects basic leading text', () => {
      const { leadingOuterText } = parseTFIdentifier(
        new StringCursor(' name = "value"')
      ).surroundingText;

      expect(leadingOuterText).toBe(' ');
    });

    it('collects leading comments', () => {
      const { leadingOuterText } = parseTFIdentifier(
        new StringCursor('/* hello world */ name = "value"')
      ).surroundingText;

      expect(leadingOuterText).toBe('/* hello world */ ');
    });
  });

  describe('identifier text', () => {
    it('terminates on equals', () => {
      expect(parseTFIdentifier(new StringCursor('hello='))).toStrictEqual<
        TFIdentifier
      >(makeTFIdentifier('hello'));
    });

    it('terminates on space', () => {
      expect(parseTFIdentifier(new StringCursor('hello '))).toStrictEqual<
        TFIdentifier
      >(makeTFIdentifier('hello'));
    });

    it('terminates on newline', () => {
      expect(parseTFIdentifier(new StringCursor('hello\n'))).toStrictEqual<
        TFIdentifier
      >(makeTFIdentifier('hello'));
    });

    it('terminates on pound comments', () => {
      expect(parseTFIdentifier(new StringCursor('hello#world'))).toStrictEqual<
        TFIdentifier
      >(makeTFIdentifier('hello'));
    });

    it('terminates on // comments', () => {
      expect(parseTFIdentifier(new StringCursor('hello//world'))).toStrictEqual<
        TFIdentifier
      >(makeTFIdentifier('hello'));
    });

    it('terminates on opening multi-line comment', () => {
      expect(parseTFIdentifier(new StringCursor('hello/*'))).toStrictEqual<
        TFIdentifier
      >(makeTFIdentifier('hello'));
    });

    it('terminates after a double quote', () => {
      expect(parseTFIdentifier(new StringCursor('"hello"'))).toStrictEqual<
        TFIdentifier
      >(makeTFIdentifier('"hello"'));
    });

    it('terminates after a single quote', () => {
      expect(parseTFIdentifier(new StringCursor("'hello'"))).toStrictEqual<
        TFIdentifier
      >(makeTFIdentifier("'hello'"));
    });
  });
});
