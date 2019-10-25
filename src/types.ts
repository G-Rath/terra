export enum TFNodeType {
  Argument = 'argument',
  Function = 'function',
  Map = 'map'
}

export type TFPrimitiveLiteral =
  | string //
  | number
  | boolean
  | null;

export interface TFMapLiteral {
  type: TFNodeType.Map;
  attributes: Array<[string, TFLiteralExpression]>;
}

export type TFLiteralExpression =
  | TFPrimitiveLiteral // todo: replace w/ Node
  | TFFunctionCall
  | TFLiteralExpression[] // todo: replace w/ Node
  | TFMapLiteral;

interface TFFunctionCall {
  type: TFNodeType.Function;
  name: string;
  args: unknown[];
}

export interface TFArgument {
  type: TFNodeType.Argument;
  identifier: string;
  expression: TFLiteralExpression;
}

export type TFBlockBody = TFArgument[];
