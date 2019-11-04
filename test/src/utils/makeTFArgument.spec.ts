import { TFNodeType } from '@src/types';
import { makeTFArgument } from '@src/utils';

describe('makeTFArgument', () => {
  it('makes a TFArgument', () => {
    expect(makeTFArgument('identifier', true)).toStrictEqual({
      type: TFNodeType.Argument,
      identifier: 'identifier',
      expression: true
    });
  });
});
