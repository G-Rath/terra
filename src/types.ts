import { AwsResourceType } from '@src/utils';

export enum TFNodeType {
  Resource = 'resource',
  Dynamic = 'dynamic',
  Argument = 'argument',
  Function = 'function',
  Block = 'block',
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

export interface TFBlockLiteral {
  type: TFNodeType.Block;

  /**
   * The name of the block literal
   */
  name: string;
  /**
   * The arguments that make up the resource.
   */
  body: TFBlockBody;
}

interface TFDynamicBlock {
  type: TFNodeType.Dynamic;
  name: string;
  content: unknown;
  labels: string[];
  forEach: unknown;
  iterator?: string;
}

export type TFBlockBody = Array<TFArgument | TFBlockLiteral | TFDynamicBlock>;

export enum RandomResourceType {
  RandomString = 'random_string',
  RandomPet = 'random_pet',
  RandomId = 'random_id'
}

export type ResourceType =
  | AwsResourceType //
  | RandomResourceType
  | string;

export type TFTopLevelBlock = TFResourceBlock;

export interface TFResourceBlock {
  type: TFNodeType.Resource;
  /**
   * The type of this resource.
   */
  resource: ResourceType;
  /**
   * The name of this resource.
   */
  name: string;
  /**
   * The body of this resource block.
   */
  body: TFBlockBody;
}
