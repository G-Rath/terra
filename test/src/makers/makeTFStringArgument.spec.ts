import {
  makeTFIdentifier,
  makeTFSimpleLiteral,
  makeTFStringArgument
} from '@src/makers';
import { TFArgument, TFNodeType } from '@src/types';

describe('makeTFStringArgument', () => {
  it('makes a TFArgument', () => {
    expect(
      makeTFStringArgument('identifier', 'expression', {
        leadingInnerText: 'hello sunshine'
      })
    ).toStrictEqual<TFArgument>({
      type: TFNodeType.Argument,
      identifier: makeTFIdentifier('identifier'),
      expression: makeTFSimpleLiteral(expect.stringContaining('expression')),
      surroundingText: {
        leadingInnerText: 'hello sunshine',
        trailingInnerText: ''
      }
    });
  });

  it('surrounds the string with double quotes', () => {
    expect(
      makeTFStringArgument(makeTFIdentifier('identifier'), 'expression', {
        leadingInnerText: 'hello sunshine'
      })
    ).toStrictEqual<TFArgument>({
      type: TFNodeType.Argument,
      identifier: makeTFIdentifier('identifier'),
      expression: makeTFSimpleLiteral(expect.stringMatching(/^".+"$/u)),
      surroundingText: {
        leadingInnerText: 'hello sunshine',
        trailingInnerText: ''
      }
    });
  });
});
