import type { AwsDataType, AwsResourceType } from '@src/utils';

export enum TFNodeType {
  Body = 'Body',
  List = 'List',
  Attribute = 'Attribute',
  Argument = 'Argument',
  Function = 'Function',
  Identifier = 'Identifier',
  Simple = 'Simple',
  Block = 'Block',
  Label = 'Label',
  Map = 'Map',
  Heredoc = 'Heredoc'
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TFBaseNode {
  //
}

export interface TFSimpleLiteral extends TFBaseNode {
  type: TFNodeType.Simple;
  value: string;
  // value:
  //   | string //
  //   | number
  //   | boolean
  //   | null;
  surroundingText: SurroundingOuterText;
}

export interface TFHeredocLiteral extends TFBaseNode {
  type: TFNodeType.Heredoc;
  delimiter: string;
  content: string;
  indented: boolean;
  surroundingText: SurroundingText;
}

export interface TFAttribute<TKey extends string = string> extends TFBaseNode {
  type: TFNodeType.Attribute;
  key: TFAttributeKey<TKey>;
  value: TFAttributeValue;
  surroundingText: SurroundingInnerText;
}

export type TFAttributeKey<TIdentifier extends string = string> =
  | TFIdentifier<TIdentifier>
  | TFLabel<TIdentifier>;

export type TFAttributeValue = TFLiteralExpression;

export interface TFMapExpression<TKey extends string = string>
  extends TFBaseNode {
  type: TFNodeType.Map;
  attributes: Array<TFAttribute<TKey>>;
  surroundingText: SurroundingText;
}

export interface SurroundingInnerText {
  leadingInnerText: string;
  trailingInnerText: string;
}

export interface SurroundingOuterText {
  leadingOuterText: string;
  trailingOuterText: string;
}

export type SurroundingText = SurroundingInnerText & SurroundingOuterText;

export interface TFLabel<TValue extends string = string> {
  type: TFNodeType.Label;
  value: TValue;
  surroundingText: SurroundingOuterText;
}

// identifiers are the same as labels except they shouldn't have quotes
export interface TFIdentifier<TValue extends string = string> {
  type: TFNodeType.Identifier;
  value: TValue;
  surroundingText: SurroundingOuterText;
}

export interface TFListExpression extends TFBaseNode {
  type: TFNodeType.List;
  values: TFLiteralExpression[];
  hasTrailingComma: boolean;
  surroundingText: SurroundingText;
}

export type TFLiteralExpression =
  | TFSimpleLiteral
  | TFFunctionCall
  | TFListExpression
  | TFMapExpression
  | TFHeredocLiteral;

export interface TFFunctionCall extends TFBaseNode {
  type: TFNodeType.Function;
  name: TFIdentifier;
  args: TFLiteralExpression[];
  hasTrailingComma: boolean;
  surroundingText: SurroundingText;
}

export interface TFArgument<TIdentifier extends string = string>
  extends TFBaseNode {
  type: TFNodeType.Argument;
  identifier: TFIdentifier<TIdentifier>;
  expression: TFLiteralExpression;
  surroundingText: SurroundingInnerText;
}

export type TFBlockBodyElement<TIdentifier extends string = string> =
  | TFArgument<TIdentifier>
  | TFBlock
  | TFDynamicBlock;

export type TFBlockBodyBody<TIdentifier extends string = string> = Array<
  TFBlockBodyElement<TIdentifier>
>;

export interface TFBlockBody<TIdentifier extends string = string> {
  type: TFNodeType.Body;
  body: TFBlockBodyBody<TIdentifier>;
  surroundingText: SurroundingText;
}

export enum RandomResourceType {
  RandomString = 'random_string',
  RandomPet = 'random_pet',
  RandomId = 'random_id'
}

export type ResourceType =
  | AwsResourceType //
  | RandomResourceType
  | string;

export type DataType =
  | ResourceType
  | AwsDataType //
  | string;

export type TFBlocks = TFBlock[];

export interface TFBlock<TIdentifier extends string = string>
  extends TFBaseNode {
  type: TFNodeType.Block;
  blockType:
    | 'resource'
    | 'data'
    | 'variable'
    | 'locals'
    | 'output'
    | 'terraform'
    | string;
  labels: TFLabel[];
  body: TFBlockBody<TIdentifier>;
  surroundingText: SurroundingOuterText;
}

export interface TFResourceBlock<TIdentifier extends string = string>
  extends TFBlock<TIdentifier> {
  blockType: 'resource';
  labels: [TFLabel<ResourceType>, TFLabel];
}

export interface TFDataBlock<TIdentifier extends string = string>
  extends TFBlock<TIdentifier> {
  blockType: 'data';
  labels: [TFLabel<DataType>, TFLabel];
}

export interface TFModuleBlock<TIdentifier extends string = string>
  extends TFBlock<TIdentifier | 'source'> {
  blockType: 'module';
  labels: [TFLabel];
}

export interface TFDynamicBlock<TIdentifier extends string = string>
  extends TFBlock<TIdentifier | 'content' | 'for_each' | 'iterator'> {
  blockType: 'dynamic';
  labels: [TFLabel];
}

export interface TFFileContents {
  blocks: TFBlock[];
  surroundingText: SurroundingOuterText;
}

/**
 * A Terraform module, made up of ASTs of the files in the module.
 * Note that a "module" is different from a "module block".
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface TFModule {
  files: { [K: string]: TFFileContents };
}
