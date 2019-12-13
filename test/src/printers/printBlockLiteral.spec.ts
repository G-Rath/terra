import { makeTFArgument, makeTFBlockLiteral } from '@src/makers';
import { printBlockBody, printBlockLiteral } from '@src/printers';
import { mocked } from 'ts-jest/utils';

jest.mock('@src/printers/printBlockBody');

describe('printBlockLiteral', () => {
  beforeEach(() =>
    mocked(printBlockBody).mockReturnValue(nameof(printBlockBody))
  );

  it('prints the expression using printBlockBody', () => {
    expect(
      printBlockLiteral(
        makeTFBlockLiteral('ingress', [makeTFArgument('from_port', 0)])
      )
    ).toMatchSnapshot();
  });

  describe('when printing braces', () => {
    beforeEach(() =>
      mocked(printBlockBody).mockReturnValue(
        ['{', `  ${nameof(printBlockBody)}`, '}'].join('\n')
      )
    );

    it('prints the opening brace on the first line', () => {
      expect(
        printBlockLiteral(makeTFBlockLiteral('ingress', []))
      ).toMatchSnapshot();
    });
  });
});
