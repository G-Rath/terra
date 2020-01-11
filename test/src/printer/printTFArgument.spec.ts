import { makeTFArgument } from '@src/makers';
import { printTFArgument } from '@src/printer';

describe('printTFArgument', () => {
  it('prints the identifier first', () => {
    expect(
      printTFArgument(
        makeTFArgument('identifier', 'expression', {
          leadingInnerText: ' ',
          trailingInnerText: ' '
        })
      )
    ).toMatch(/^identifier/u);
  });

  it('prints the leadingInnerText after the identifier and before the equals', () => {
    expect(
      printTFArgument(
        makeTFArgument('identifier', '', {
          leadingInnerText: 'leadingInnerText',
          trailingInnerText: ''
        })
      )
    ).toMatch(/leadingInnerText=$/u);
  });

  it('prints the trailingInnerText before the expression and after the equals', () => {
    expect(
      printTFArgument(
        makeTFArgument('', 'expression', {
          leadingInnerText: '',
          trailingInnerText: 'trailingInnerText'
        })
      )
    ).toMatch(/^=trailingInnerText/u);
  });

  it('prints the expression last', () => {
    expect(
      printTFArgument(
        makeTFArgument('identifier', 'expression', {
          leadingInnerText: ' ',
          trailingInnerText: ' '
        })
      )
    ).toMatch(/expression$/u);
  });
});
