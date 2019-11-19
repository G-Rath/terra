import { makeTFResourceBlock } from '@src/makers';
import {
  logChar,
  TFBlockBodyParser,
  TFLabelParser,
  TFParser
} from '@src/parsers';
import { TFBlockBodyBody, TFResourceBlock } from '@src/types';

export class TFResourceParser implements TFParser<TFResourceBlock> {
  private _resource: string | null = null;
  private _name: string | null = null;
  private _body: TFBlockBodyBody | null = null;
  private _currentParser:
    | TFLabelParser
    | TFBlockBodyParser
    | null = new TFLabelParser();

  parse(char: string) {
    logChar(char, this);

    if (!this._currentParser) {
      throw new Error('Parse called without a parser');
    }

    if (!this._currentParser.parse(char)) {
      return false;
    }

    if (this._currentParser instanceof TFBlockBodyParser) {
      this._body = this._currentParser.collect();

      return true;
    }

    if (this._resource === null) {
      this._resource = this._currentParser.collect();
      this._currentParser = new TFLabelParser();

      return false;
    }

    if (this._name === null) {
      this._name = this._currentParser.collect();
      this._currentParser = new TFBlockBodyParser();

      return false;
    }

    throw new Error('unexpected TFLabelParser encountered');
  }

  collect() {
    if (!this._resource || !this._name || !this._body) {
      throw new Error('collection not finished');
    }

    return makeTFResourceBlock(
      this._name, //
      this._resource,
      this._body
    );
  }
}
