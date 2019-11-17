import { makeTFStringArgument } from '@src/makers';
import { TFNodeType } from '@src/types';

describe('makeTFStringArgument', () => {
  it('makes a TFArgument', () => {
    expect(makeTFStringArgument('identifier', 'expression')).toStrictEqual({
      type: TFNodeType.Argument,
      identifier: 'identifier',
      expression: expect.stringContaining('expression')
    });
  });

  it('surrounds the string with double quotes', () => {
    expect(makeTFStringArgument('identifier', 'expression')).toStrictEqual({
      type: TFNodeType.Argument,
      identifier: 'identifier',
      expression: expect.stringMatching(/^".+"$/)
    });
  });
});
