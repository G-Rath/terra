export class StringCursor {
  /**
   * The string that this cursor is navigating.
   */
  private _string: string;
  /**
   * The current position of this cursor.
   */
  private _position: number;

  constructor(str: string) {
    this._string = str;
    this._position = 0;
  }

  /**
   * The char that this cursor is currently under.
   *
   * @return {string}
   */
  get char() {
    return this._string.charAt(this.position);
  }

  /**
   * The position of this cursor.
   *
   * @return {number}
   */
  get position() {
    return this._position;
  }

  /**
   * Rewinds the cursor back by the given `amount` of characters.
   */
  rewind(amount: number) {
    this._position -= amount;

    if (this.position < 0) {
      throw new Error('Cannot rewind past start of string');
    }

    return this.char;
  }

  /**
   * Advance the cursor forward by a character, returning the character that was
   * advanced over.
   *
   * An error is thrown if you try to advance past the end of the string.
   *
   * @return {string}
   */
  advance(): string {
    const char = this.char;

    this._position += 1;

    if (this.position > this._string.length) {
      throw new Error('Cannot advance past end of string');
    }

    return char;
  }

  /**
   * Peek ahead at the next character in the string.
   *
   * An error is thrown if you try to peek past the end of the string.
   *
   * @return {string}
   */
  peek(): string {
    if (this.isAtEnd()) {
      throw new Error('Cannot peek past end of string');
    }

    return this._string.charAt(this.position + 1);
  }

  /**
   * Checks if the cursor is at the start of the string.
   *
   * @return {boolean}
   */
  isAtStart() {
    return this.position === 0;
  }

  /**
   * Checks if the cursor has another character after the one it's under.
   *
   * @return {boolean}
   */
  hasNextChar() {
    return this.position < this._string.length - 1;
  }

  /**
   * Checks if the cursor is at the end of the string.
   */
  isAtEnd() {
    return this.position === this._string.length;
  }

  /**
   * Collects all the characters from the current position up until the given `predicate` is meet.
   *
   * If the predicate is an array, each element is compared against until one matches.
   *
   * @param {string|Array<string|RegExp>} predicate
   *
   * @return {string}
   */
  collectUntil(predicate: (string | RegExp) | Array<string | RegExp>): string {
    const predicates = Array.isArray(predicate) ? predicate : [predicate];
    let collection = '';

    do {
      if (this.isAtEnd()) {
        throw new Error(
          [
            'Failed to match predicate before reaching end of string', //
            predicate,
            collection
          ].join('\n')
        );
      }

      collection += this.advance();
    } while (
      !predicates.some(str =>
        typeof str === 'string'
          ? collection.endsWith(str) //
          : str.test(collection)
      )
    );

    return collection;
  }

  /**
   * Collects all the characters from the current position up until the given `predicate` is meet.
   * Comments are automatically collected if encountered.
   *
   * If the predicate is an array, each element is compared against until one matches.
   *
   * @param {string|Array<string|RegExp>} predicate
   *
   * @return {string}
   */
  collectUntilWithComments(
    predicate: (string | RegExp) | Array<string | RegExp>
  ): string {
    const predicates = Array.isArray(predicate) ? predicate : [predicate];
    let collection = '';

    do {
      collection += this.collectUntil(['/*', '//', '#', ...predicates]);

      if (collection.endsWith('//') || collection.endsWith('#')) {
        collection += this.collectUntil('\n');

        continue;
      }

      if (collection.endsWith('/*')) {
        collection += this.collectUntil('*/');

        continue;
      }

      break;
    } while (this.char);

    return collection;
  }
}
