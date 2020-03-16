import { TFHeredocLiteral, TFNodeType } from '@src/types';

export const makeTFHeredocLiteral = (
  delimiter: string,
  content: string,
  indented: boolean,
  surroundingText?: Partial<TFHeredocLiteral['surroundingText']>
): TFHeredocLiteral => ({
  type: TFNodeType.Heredoc,
  delimiter,
  content,
  indented,
  surroundingText: {
    leadingOuterText: '',
    leadingInnerText: '\n',
    trailingInnerText: '\n',
    trailingOuterText: '',
    ...surroundingText
  }
});
