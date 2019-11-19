import { makeTFBlockLiteral } from '@src/makers';
import { TFBlockBodyParser, TFParser } from '@src/parsers';
import { TFBlockLiteral } from '@src/types';

export class TFBlockLiteralParser implements TFParser<TFBlockLiteral> {
  private readonly _name: string;
  private readonly _bodyParser = new TFBlockBodyParser();

  constructor(name: string) {
    this._name = name;
  }

  parse(char: string) {
    return false;
  }

  collect() {
    return makeTFBlockLiteral(this._name, this._bodyParser.collect());
  }
}
