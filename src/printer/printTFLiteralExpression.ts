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
  switch (literal.type) {
    case TFNodeType.Simple:
      return printTFSimpleLiteral(literal);
    case TFNodeType.List:
      return printTFListExpression(literal);
    case TFNodeType.Map:
      return printTFMapExpression(literal);
    case TFNodeType.Function:
      return printTFFunctionCall(literal);

    default: {
      const { type } = literal as { type: string };

      throw new Error(`structural error - cannot print type "${type}"`);
    }
  }
};
