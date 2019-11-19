import { TFParser } from '@src/parsers';
import { TFLiteralExpression } from '@src/types';
import { assertQuotedStringIsClosed } from '@src/utils';

export class TFExpressionParser implements TFParser<TFLiteralExpression> {
  private _currentParser: TFParser<TFLiteralExpression> | null = null;
  private _completedParsers: Array<TFParser<TFLiteralExpression>> = [];
  private _expression = '';
  private _leadingText = '';
  private _trailingText = '';

  parse(char: string) {
    if (this._currentParser) {
      if (char === '\n' && this._completedParsers.length === 0) {
        return false;
      }

      if (this._currentParser.parse(char)) {
        this._completedParsers.push(this._currentParser);
        this._currentParser = null;
      }

      return false;
    }

    if (char === ' ' && this._expression.length === 0) {
      this._leadingText += char;

      return false;
    }

    if (char === '\n' || (char === ' ' && !this._expression.startsWith('"'))) {
      assertQuotedStringIsClosed(this._expression);

      this._trailingText += char;

      return true;
    }

    if (this._expression.length) {
      if (!isNaN(parseInt(this._expression[0], 10))) {
        if (isNaN(parseInt(char, 10))) {
          // console.log(this._expression);
          throw new Error(`unexpected "${char}" in number literal expression`);
        }

        this._expression += char;

        return false;
      }
    }

    if (char === '[') {
      this._currentParser = new TFExpressionParser();
    }

    if (char === ']') {
      return true;
    }

    this._expression += char;

    return false;
  }

  collect() {
    if (this._completedParsers.length) {
      return this._completedParsers.map(parser => parser.collect());
    }

    return this._expression;
  }
}
