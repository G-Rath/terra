import { logChar } from '@src/parsers/index';
import { TFParser } from '@src/parsers/parseTFFileContents';

export class TFIdentifierParser implements TFParser<string> {
  private _leadingText = '';
  private _trailingText = '';
  private _identifier = '';

  parse(char: string) {
    logChar(char, this);

    if (this._identifier.length) {
      if (char === '\n') {
        throw new Error('newlines are not allowed in identifiers');
      }

      if (char === ' ') {
        this._trailingText += char;

        return false;
      }
    }

    if (char === '\n' || char === ' ') {
      this._leadingText += char;

      return false;
    }

    if (char === '"') {
      throw new Error('quotes are not allowed in identifiers');
    }

    if (char === '=') {
      return true;
    }

    this._identifier += char;

    return false;
  }

  collect() {
    return this._identifier;
  }
}
