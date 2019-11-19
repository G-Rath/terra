import { logChar } from '@src/parsers/index';
import { TFParser } from '@src/parsers/parseTFFileContents';
import { assertQuotedStringIsClosed } from '@src/utils';

export class TFLabelParser implements TFParser<string> {
  private _label = '';
  private _leadingText = '';
  private _trailingText = '';

  parse(char: string) {
    logChar(char, this);

    if (char === '\n') {
      throw new Error('newlines are not allowed in or leading to labels');
    }

    if (char === ' ') {
      if (this._label.length === 0) {
        this._leadingText += char;

        return false;
      }

      if (!this._label.startsWith('"')) {
        throw new Error('labels containing spaces must be quoted');
      }
    }

    this._label += char;

    if (this._label.length > 1 && char === '"') {
      assertQuotedStringIsClosed(this._label);

      return true;
    }

    return false;
  }

  collect() {
    return this._label;
  }
}
