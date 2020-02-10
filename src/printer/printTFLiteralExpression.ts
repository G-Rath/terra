import {
  printTFFunctionCall,
  printTFListExpression,
  printTFMapExpression,
  printTFSimpleLiteral
} from '@src/printer';
import { TFLiteralExpression, TFNodeType } from '@src/types';

export const printTFLiteralExpression = (
  literal: TFLiteralExpression
): string => {
  if (literal.type === TFNodeType.Simple) {
    return printTFSimpleLiteral(literal);
  }

  if (literal.type === TFNodeType.List) {
    return printTFListExpression(literal);
  }

  const type = literal.type;

  if (literal.type === TFNodeType.Map) {
    return printTFMapExpression(literal);
  }

  if (literal.type === TFNodeType.Function) {
    return printTFFunctionCall(literal);
  }

  throw new Error(`structural error - cannot print type "${type}"`);
};
