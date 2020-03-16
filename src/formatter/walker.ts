import {
  TFArgument,
  TFAttribute,
  TFBlock,
  TFBlockBody,
  TFFunctionCall,
  TFHeredocLiteral,
  TFIdentifier,
  TFLabel,
  TFListExpression,
  TFMapExpression,
  TFSimpleLiteral
} from '@src/types';

export type TFNode =
  | TFBlockBody
  | TFListExpression
  | TFAttribute
  | TFArgument
  | TFFunctionCall
  | TFIdentifier
  | TFSimpleLiteral
  | TFBlock
  | TFLabel
  | TFMapExpression
  | TFHeredocLiteral;

// interface TFNodeMap {
//   Body: TFBlockBody;
//   List: TFListExpression;
//   Attribute: TFAttribute;
//   Argument: TFArgument;
//   Function: TFFunctionExpression;
//   Identifier: TFIdentifier;
//   Simple: TFSimpleLiteral;
//   Block: TFBlock;
//   Label: TFLabel;
//   Map: TFMapExpression;
// }

type TFNodeListenerFn<T extends TFNode = never> = (node: T) => void;

export interface TFNodeListenerPair<T extends TFNode = never> {
  enter?: TFNodeListenerFn<T>;
  exit?: TFNodeListenerFn<T>;
}

type TFNodeListener<T extends TFNode = never> =
  | TFNodeListenerPair<T>
  | TFNodeListenerFn<T>;

interface NodeListeners {
  Body?: TFNodeListener<TFBlockBody>;
  List?: TFNodeListener<TFListExpression>;
  Attribute?: TFNodeListener<TFAttribute>;
  Argument?: TFNodeListener<TFArgument>;
  Function?: TFNodeListener<TFFunctionCall>;
  Identifier?: TFNodeListener<TFIdentifier>;
  Simple?: TFNodeListener<TFSimpleLiteral>;
  Block?: TFNodeListener<TFBlock>;
  Label?: TFNodeListener<TFLabel>;
  Map?: TFNodeListener<TFMapExpression>;
  Heredoc?: TFNodeListener<TFHeredocLiteral>;
}

// type PickTFNode<T extends TFNodeType> = TFNode extends infer TNode
//   ? TNode extends { type: T }
//     ? TNode
//     : never
//   : never;
// type NodeListenersAuto = {
//   [K in TFNodeType]?: TFNodeListener<PickTFNode<K>>;
// };

const isTFNode = (possibleNode: unknown): possibleNode is TFNode =>
  typeof possibleNode === 'object' &&
  possibleNode !== null &&
  'type' in possibleNode;

const walkIfNode = (maybeNode: unknown, listeners: NodeListeners): void => {
  if (isTFNode(maybeNode)) {
    walkNode(maybeNode, listeners);

    return;
  }

  if (Array.isArray(maybeNode)) {
    maybeNode.map(node => walkIfNode(node, listeners));
  }
};

const getListenerPairForNode = <TNode extends TFNode>(
  node: TNode,
  listeners: NodeListeners
): TFNodeListenerPair<TNode> | null => {
  // TS can't reason that the property existing means the node is of the right type
  const listener = listeners[node.type] as TFNodeListener<TNode> | undefined;

  if (!listener) {
    return null;
  }

  if (typeof listener === 'function') {
    return { enter: listener };
  }

  return listener;
};

export const walkNode = <TTheNode extends TFNode>(
  node: TTheNode,
  listeners: NodeListeners
): TTheNode => {
  const listenerPairForNode = getListenerPairForNode(node, listeners);

  listenerPairForNode?.enter?.(node);
  Object.values(node).forEach(maybeNode => walkIfNode(maybeNode, listeners));
  listenerPairForNode?.exit?.(node);

  return node;
};

export const walkNodes = <TTheNode extends TFNode>(
  nodes: TTheNode[],
  listeners: NodeListeners
): TTheNode[] => nodes.map(node => walkNode(node, listeners));
