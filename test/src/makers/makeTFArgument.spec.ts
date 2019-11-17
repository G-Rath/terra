import { makeTFArgument } from '@src/makers';
import { TFNodeType } from '@src/types';

describe('makeTFArgument', () => {
  it('makes a TFArgument', () => {
    expect(makeTFArgument('identifier', true)).toStrictEqual({
      type: TFNodeType.Argument,
      identifier: 'identifier',
      expression: true
    });
  });
});
