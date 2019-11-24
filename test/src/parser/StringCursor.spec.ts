import { StringCursor } from '@src/parser';

describe('StringCursor', () => {
  const str = 'hello world';
  let cursor: StringCursor;

  beforeEach(() => (cursor = new StringCursor(str)));

  describe('when constructed', () => {
    it('starts at the first char', () => {
      expect(cursor.char).toBe(str[0]);
    });

    it('starts at position 0', () => {
      expect(cursor.position).toBe(0);
    });
  });

  describe('when given an empty string', () => {
    beforeEach(() => (cursor = new StringCursor('')));

    it('is both at the start and end', () => {
      expect(cursor.isAtStart()).toBe(true);
      expect(cursor.isAtEnd()).toBe(true);
    });

    it('does not have a next char', () => {
      expect(cursor.hasNextChar()).toBe(false);
    });
  });
  describe('instance methods', () => {
    describe('#rewind', () => {
      beforeEach(() => {
        do {
          cursor.advance();
        } while (!cursor.isAtEnd());
      });

      it('decrements position by the given amount', () => {
        cursor.rewind(5);

        expect(cursor.position).toBe(str.length - 5);
      });

      it('returns the char at the new position', () => {
        expect(cursor.rewind(1)).toBe(str[str.length - 1]);
      });

      describe('when rewinding past the start of the string', () => {
        it('throws', () => {
          expect(() => cursor.rewind(str.length + 2)).toThrow(
            'Cannot rewind past start of string'
          );
        });
      });
    });

    describe('#advance', () => {
      it('increments position by 1', () => {
        cursor.advance();

        expect(cursor.position).toBe(1);
      });

      it('returns the char at the previous position', () => {
        expect(cursor.advance()).toBe(str[0]);
      });

      it('will never return a blank character', () => {
        const values: string[] = [];

        expect(() => {
          do {
            values.push(cursor.advance());

            expect(values.length).toBeLessThanOrEqual(str.length);
          } while (cursor); // inf. loop - in case we fail ^^
        }).toThrow('Cannot advance past end of string');

        expect(values).not.toContain('');
        expect(values).toStrictEqual([...str]);
      });
    });

    describe('#peek', () => {
      it('returns the next character in the string', () => {
        expect(cursor.peek()).toBe(str[1]);
      });

      describe('when at the end of the string', () => {
        it('throws', () => {
          jest.spyOn(cursor, 'position', 'get').mockReturnValue(str.length);

          expect(() => cursor.peek()).toThrow('Cannot peek past end of string');
        });
      });
    });

    describe('#isAtStart', () => {
      describe('when position is equal to 0', () => {
        it('is at the start', () => {
          jest.spyOn(cursor, 'position', 'get').mockReturnValue(0);

          expect(cursor.isAtStart()).toBe(true);
        });
      });

      describe('when position is greater than 0', () => {
        it('is not at the start', () => {
          jest.spyOn(cursor, 'position', 'get').mockReturnValue(str.length);

          expect(cursor.isAtStart()).toBe(false);
        });
      });
    });

    describe('#hasNextChar', () => {
      describe('when position is less than that of the last char', () => {
        it('returns true', () => {
          jest.spyOn(cursor, 'position', 'get').mockReturnValue(str.length - 5);

          expect(cursor.hasNextChar()).toBe(true);
        });
      });

      describe('when position equals that of the last char', () => {
        it('returns false', () => {
          jest.spyOn(cursor, 'position', 'get').mockReturnValue(str.length - 1);

          expect(cursor.hasNextChar()).toBe(false);
        });
      });
    });

    describe('#isAtEnd', () => {
      describe('when position equals the length of the string', () => {
        it('is at the end', () => {
          jest.spyOn(cursor, 'position', 'get').mockReturnValue(str.length);

          expect(cursor.isAtEnd()).toBe(true);
        });
      });

      describe('when position is less than the length of the string', () => {
        it('is not at the end', () => {
          jest.spyOn(cursor, 'position', 'get').mockReturnValue(5);

          expect(cursor.isAtEnd()).toBe(false);
        });
      });
    });

    describe('#collectUntil', () => {
      describe('when the predicate is a string', () => {
        it('collects up to the whole predicate', () => {
          expect(cursor.collectUntil('world')).toBe('hello world');
        });

        it('advances the position of the cursor', () => {
          const predicate = 'hello';

          cursor.collectUntil(predicate);

          expect(cursor.position).toBe(predicate.length);
        });
      });

      describe('when the predicate is an array', () => {
        it('only requires one element to match', () => {
          expect(
            cursor.collectUntil([
              'sunshine', //
              'world'
            ])
          ).toBe('hello world');
        });
      });

      describe('when the predicate is a regexp', () => {
        it('tests appropriately', () => {
          expect(cursor.collectUntil([/.l/])).toBe('hel');
        });

        it('works with negation', () => {
          expect(cursor.collectUntil([/[^\w]/])).toBe('hello ');
        });
      });

      describe('when the predicate is never satisfied', () => {
        it('throws', () => {
          expect(() => cursor.collectUntil('sunshine')).toThrow(
            'Failed to match predicate before reaching end of string'
          );
        });
      });

      describe('when collecting multiple times', () => {
        it('does not overlap', () => {
          expect(cursor.collectUntil('hello')).toBe('hello');
          expect(cursor.collectUntil('world')).toBe(' world');
        });
      });
    });

    describe('#collectUntilWithComments', () => {
      beforeEach(() => (cursor = new StringCursor('')));

      it('collects /**/ comments', () => {
        cursor = new StringCursor('hello /* world */ world');

        expect(cursor.collectUntilWithComments('world')).toBe(
          'hello /* world */ world'
        );
      });

      it('collects // comments', () => {
        cursor = new StringCursor(
          [
            'hello', //
            '// hello world',
            'world'
          ].join('\n')
        );

        expect(cursor.collectUntilWithComments('world')).toBe(
          [
            'hello', //
            '// hello world',
            'world'
          ].join('\n')
        );
      });

      it('collects # comments', () => {
        cursor = new StringCursor(
          [
            'hello', //
            '# hello world',
            'world'
          ].join('\n')
        );

        expect(cursor.collectUntilWithComments('world')).toBe(
          [
            'hello', //
            '# hello world',
            'world'
          ].join('\n')
        );
      });
      describe('when the predicate is only in comments', () => {
        it('throws', () => {
          cursor = new StringCursor('hello # hello world');

          expect(() => cursor.collectUntilWithComments('world')).toThrow(
            'Failed to match predicate before reaching end of string'
          );
        });
      });
    });
  });
});
