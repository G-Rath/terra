import {
  logChar,
  logger,
  TFBlockBodyElementParser,
  TFParser
} from '@src/parsers';
import { TFBlockBodyBody } from '@src/types';

// type TFBlockBodyElementParser = TFArgumentParser;

export class TFBlockBodyParser implements TFParser<TFBlockBodyBody> {
  private _currentParser: TFBlockBodyElementParser | null = null;
  private _completedParsers: TFBlockBodyElementParser[] = [];
  private _leadingText = '';
  private _trailingInnerText = '';

  private _createNewElementParser(char: string) {
    this._currentParser = new TFBlockBodyElementParser();

    const previousIndent = logger.indentLevel;
    for (const char of this._trailingInnerText) {
      this._currentParser.parse(char);
    }

    this._trailingInnerText = '';

    // this._currentParser
  }

  /**
   * Re-parses the leading text buffer of this parser into the given parser.
   *
   * This clears the leading text buffer.
   *
   * @param {TFBlockBodyElementParser} parser
   * @private
   */
  private _reparseBuffersIntoNewParser(parser: TFBlockBodyElementParser) {
    // const previousIndent = logger.indentLevel;
    for (const char of this._leadingText) {
      // logger.logChar(char, this, true);
      parser.parse(char);
      // logger.indentLevel = previousIndent;
    }

    this._leadingText = '';
  }

  parse(char: string) {
    logChar(char, this, true);

    if (this._currentParser) {
      if (this._currentParser.parse(char)) {
        this._completedParsers.push(this._currentParser);
        this._currentParser = null;
      }

      return false;
    }

    if (char === '{') {
      return false;
    }

    if (char === '}') {
      return true;
    }

    if (char !== ' ' && char !== '\n') {
      this._currentParser = new TFBlockBodyElementParser();
      this._reparseBuffersIntoNewParser(this._currentParser);
      this._currentParser.parse(char);

      return false;
    }

    return false;

    // if (char === '{') {
    //   this._currentParser = new TFArgumentParser();
    //
    //   return false;
    // }
    //
    // console.log(char);
    // switch (char) {
    //   case '\n':
    //     if (!this._currentParser) {
    //       return false;
    //     }
    //     throw new Error('unexpected newline');
    //   case ' ':
    //     this._lookAheadBuffer += char;
    //     if (!this._lookAheadBuffer.length) {
    //       this._leadingText += char;
    //
    //       return false;
    //     }
    //
    //     if (this._lookAheadBuffer === 'dynamic') {
    //       throw new Error('dynamic blocks are not yet supported');
    //     }
    //
    //     return false;
    //   case '=': // argument
    //     this._currentParser = new TFArgumentParser();
    //
    //     this._reparseBuffersIntoNewParser(this._currentParser);
    //
    //     return false;
    //   case '{': // block literal
    //     throw new Error('literal blocks are not yet supported');
    //     // this._currentParser = new TFBlockLiteralParser();
    //     // this._reparseBuffersIntoNewParser(this._currentParser);
    //
    //     return false;
    //   case '}':
    //     return true;
    //   case '"':
    //     // console.log(this._lookAheadBuffer, char);
    //     throw new Error('quotes cannot be used on the left of a body element');
    //   default:
    //     this._lookAheadBuffer += char;
    //   // throw new Error(`unexpected "${char}" in block body`);
    // }
    //
    // return false;
  }

  collect() {
    return this._completedParsers.map(parser => parser.collect());
  }
}
