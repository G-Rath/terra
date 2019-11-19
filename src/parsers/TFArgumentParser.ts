import { makeTFArgument } from '@src/makers';
import { logChar, TFExpressionParser, TFParser } from '@src/parsers';
import { TFIdentifierParser } from '@src/parsers/TFIdentifierParser';
import { TFArgument, TFLiteralExpression } from '@src/types';

export class TFArgumentParser implements TFParser<TFArgument> {
  private _identifier: string | null = null;
  private _expression: TFLiteralExpression | null = null;
  private _leadingText = '';

  private _currentParser:
    | TFIdentifierParser
    | TFExpressionParser
    // | null = new TFIdentifierParser();
    | null = null;

  parse(char: string) {
    logChar(char, this, true);

    if (!this._currentParser) {
      if (char !== ' ' && char !== '\n') {
        this._currentParser = new TFIdentifierParser();
        this._currentParser.parse(char);

        return false;
      }

      this._leadingText += char;

      return false;
      // throw new Error('Parse called without a parser');
    }

    if (this._currentParser.parse(char)) {
      if (this._currentParser instanceof TFIdentifierParser) {
        this._identifier = this._currentParser.collect();
        // console.log(this._identifier);
        this._currentParser = new TFExpressionParser();

        return false;
      }

      this._expression = this._currentParser.collect();
      this._currentParser = null;

      return true;
    }

    return false;
  }

  collect() {
    if (!this._identifier || !this._expression) {
      throw new Error('collection not finished');
    }

    return makeTFArgument(this._identifier, this._expression);
  }
}
