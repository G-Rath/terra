import { StringCursorRecorder } from '@src/parser';

export class StringCursor {
  /**
   * The string that this cursor is navigating.
   */
  private readonly _string: string;
  /**
   * The current position of this cursor.
   */
  private _position: number;

  public readonly recorder: StringCursorRecorder | null;

  public constructor(
    str: string,
    recorder: StringCursorRecorder | null = new StringCursorRecorder(str)
  ) {
    this._string = str;
    this._position = 0;

    this.recorder = recorder;

    if (this.recorder) {
      /* eslint-disable @typescript-eslint/unbound-method */
      this.rewind = this.recorder.wrapMethod(this, this.rewind);
      this.advance = this.recorder.wrapMethod(this, this.advance);
      this.peek = this.recorder.wrapMethod(this, this.peek);
      this.collectUntil = this.recorder.wrapMethod(this, this.collectUntil);
      this.collectUntilWithComments = this.recorder.wrapMethod(
        this,
        this.collectUntilWithComments
      );
      /* eslint-enable @typescript-eslint/unbound-method */
    }
  }

  /**
   * The char that this cursor is currently under.
   *
   * @return {string}
   */
  public get char() {
    return this._string.charAt(this.position);
  }

  /**
   * The position of this cursor.
   *
   * @return {number}
   */
  public get position() {
    return this._position;
  }

  /**
   * Rewinds the cursor back by the given `amount` of characters.
   */
  public rewind(amount: number) {
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
  public advance(): string {
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
  public peek(): string {
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
  public isAtStart() {
    return this.position === 0;
  }

  /**
   * Checks if the cursor has another character after the one it's under.
   *
   * @return {boolean}
   */
  public hasNextChar() {
    return this.position < this._string.length - 1;
  }

  /**
   * Checks if the cursor is at the end of the string.
   */
  public isAtEnd() {
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
  public collectUntil(
    predicate: (string | RegExp) | Array<string | RegExp>
  ): string {
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
  public collectUntilWithComments(
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
