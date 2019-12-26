import { makeTFIdentifier, makeTFSimpleLiteral } from '@src/makers';
import {
  TFFunctionExpression,
  TFIdentifier,
  TFLiteralExpression,
  TFNodeType
} from '@src/types';

export const makeTFFunctionExpression = (
  name: string | TFIdentifier,
  args: Array<TFLiteralExpression | string>,
  hasTrailingComma = false,
  surroundingText?: Partial<TFFunctionExpression['surroundingText']>
): TFFunctionExpression => ({
  type: TFNodeType.Function,
  name:
    typeof name === 'string' //
      ? makeTFIdentifier(name)
      : name,
  args: args.map(v => (typeof v === 'string' ? makeTFSimpleLiteral(v) : v)),
  hasTrailingComma,
  surroundingText: {
    leadingInnerText: '',
    leadingOuterText: '',
    trailingInnerText: '',
    trailingOuterText: '',
    ...surroundingText
  }
});
