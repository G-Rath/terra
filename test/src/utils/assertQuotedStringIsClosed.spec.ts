import { assertQuotedStringIsClosed } from '@src/utils';

describe('assertQuotedStringIsClosed', () => {
  describe('when str starts with a single quote', () => {
    describe('when str has only one character', () => {
      it('throws', () => {
        expect(() => assertQuotedStringIsClosed("'")).toThrow(
          "missing closing ' quote"
        );
      });
    });

    describe('when str ends with a single quote', () => {
      it('does nothing', () => {
        expect(() => assertQuotedStringIsClosed("'hello world'")).not.toThrow();
      });
    });

    describe('when str ends with a double quote', () => {
      it('throws', () => {
        expect(() => assertQuotedStringIsClosed('\'hello world"')).toThrow(
          "missing closing ' quote"
        );
      });
    });

    describe('when str ends with neither quote', () => {
      it('throws', () => {
        expect(() => assertQuotedStringIsClosed("'hello world")).toThrow(
          "missing closing ' quote"
        );
      });
    });
  });

  describe('when str starts with a double quote', () => {
    describe('when str has only one character', () => {
      it('throws', () => {
        expect(() => assertQuotedStringIsClosed('"')).toThrow(
          'missing closing " quote'
        );
      });
    });

    describe('when str ends with a single quote', () => {
      it('throws', () => {
        expect(() => assertQuotedStringIsClosed('"hello world\'')).toThrow(
          'missing closing " quote'
        );
      });
    });

    describe('when str ends with a double quote', () => {
      it('does nothing', () => {
        expect(() => assertQuotedStringIsClosed('"hello world"')).not.toThrow();
      });
    });

    describe('when str ends with neither quote', () => {
      it('throws', () => {
        expect(() => assertQuotedStringIsClosed('"hello world')).toThrow(
          'missing closing " quote'
        );
      });
    });
  });

  describe('when str starts with neither quote', () => {
    describe('when str has only one character', () => {
      it('does nothing', () => {
        expect(() => assertQuotedStringIsClosed(' ')).not.toThrow();
      });
    });

    describe('when str ends with a single quote', () => {
      it('does nothing', () => {
        expect(() => assertQuotedStringIsClosed('hello world')).not.toThrow();
      });
    });

    describe('when str ends with a double quote', () => {
      it('does nothing', () => {
        expect(() => assertQuotedStringIsClosed('hello world')).not.toThrow();
      });
    });

    describe('when str ends with neither quote', () => {
      it('does nothing', () => {
        expect(() => assertQuotedStringIsClosed('hello world')).not.toThrow();
      });
    });
  });
});
