import { makeTFArgument } from '@src/makers';
import { TFArgument, TFNodeType } from '@src/types';

describe('makeTFArgument', () => {
  it('makes a TFArgument', () => {
    expect(
      makeTFArgument('identifier', true, {
        leadingInnerText: 'hello world'
      })
    ).toStrictEqual<TFArgument>({
      type: TFNodeType.Argument,
      identifier: 'identifier',
      expression: true,
      surroundingText: {
        leadingInnerText: 'hello world',
        trailingInnerText: ''
      }
    });
  });
});
