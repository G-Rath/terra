export * from './parseTFFile';
export * from './parseTFFileContents';
export * from './TFResourceParser';
export * from './TFBlockBodyParser';
export * from './TFBlockLiteralParser';
export * from './TFArgumentParser';
export * from './TFExpressionParser';
export * from './TFLabelParser';
export * from './TFIdentifierParser';
export * from './TFBlockBodyElementParser';

class ParserLogger {
  private _indentLevel = -1;

  get indentLevel() {
    return this._indentLevel;
  }

  set indentLevel(indentLevel: number) {
    this._indentLevel = indentLevel;
  }

  reset() {
    this.indentLevel = -1;
  }

  logChar(
    char: string,
    parser: { constructor: { name: string } },
    actLikeNewChain = false
  ) {
    return;
    this.indentLevel += 1;

    if (actLikeNewChain || !this.indentLevel) {
      return console.log(
        char,
        'via',
        parser.constructor.name,
        actLikeNewChain ? '*' : ''
      );
    }

    console.log(
      ' ',
      ' '.repeat(this.indentLevel),
      '\\-',
      parser.constructor.name
    );
  }
}

export const logger = new ParserLogger();
export const logChar = logger.logChar.bind(logger);

/*
// use a "Pointer" class to maintain the parsing of the string
class Pointer {
  get currentChar() {
    return this.getCharAtPoint();
  }

  getCharAtPoint() {
  }
}
 */
