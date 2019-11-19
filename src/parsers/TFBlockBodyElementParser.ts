import {
  logChar,
  TFArgumentParser,
  TFBlockLiteralParser,
  TFParser
} from '@src/parsers';
import { TFBlockBodyElement } from '@src/types';

type TFBlockBodyElementInnerParser = TFArgumentParser | TFBlockLiteralParser;

export class TFBlockBodyElementParser implements TFParser<TFBlockBodyElement> {
  private _innerParser: TFBlockBodyElementInnerParser | null = null;
  private _result: TFBlockBodyElement | null = null;
  private _leadingText = '';
  private _lookAheadBuffer = '';

  /**
   * Re-parses the leading & look ahead text buffers that this parser has collected
   * in order to determine the parser to use into the parser that was settled on.
   *
   * This clears the leading & look ahead text buffers.
   *
   * @param {TFBlockBodyElementInnerParser} parser
   * @private
   */
  private _reparseBuffersIntoNewParser(parser: TFBlockBodyElementInnerParser) {
    console.log('leadingText buffer', this._leadingText);
    // const previousIndent = logger.indentLevel;
    for (const char of this._leadingText) {
      // logger.logChar(char, this, true);
      parser.parse(char);
      // logger.indentLevel = previousIndent;
    }

    console.log('_lookAheadBuffer', this._lookAheadBuffer);
    for (const char of this._lookAheadBuffer) {
      // logger.logChar(char, this, true);
      parser.parse(char);
      // logger.indentLevel = previousIndent;
    }

    this._leadingText = '';
    this._lookAheadBuffer = '';
  }

  // private _inferNewParserFromBuffer() {}

  parse(char: string) {
    logChar(char, this);

    if (this._innerParser) {
      if (this._innerParser.parse(char)) {
        this._result = this._innerParser.collect();

        return true;
      }

      return false;
    }

    if (char === ' ') {
      // if (this._lookAheadBuffer.length) {
      // }

      this._leadingText += char;
    }

    if (char === '=') {
      this._innerParser = new TFArgumentParser();

      this._reparseBuffersIntoNewParser(this._innerParser);
      this._innerParser.parse(char);

      return false;
    }

    // if (char === '{') {
    //   this._innerParser = new TFArgumentParser();
    //
    //   return false;
    // }

    this._lookAheadBuffer += char;

    return false;
  }

  collect() {
    if (!this._result) {
      throw new Error('not ready to collect');
    }

    return this._result;
  }
}
