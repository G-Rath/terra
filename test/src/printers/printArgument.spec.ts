import { makeTFArgument } from '@src/makers';
import { printArgument, printLiteralExpression } from '@src/printers';
import { TFNodeType } from '@src/types';
import { mocked } from 'ts-jest/utils';

jest.mock('@src/printers/printLiteralExpression');

describe('printArgument', () => {
  beforeEach(() =>
    mocked(printLiteralExpression).mockReturnValue(
      nameof(printLiteralExpression)
    )
  );

  it('prints the expression using printLiteralExpression', () => {
    expect(printArgument(makeTFArgument('name', '"world"'))).toMatchSnapshot();
  });

  it.todo('quotes the identifier when required');

  describe('when the expression has braces', () => {
    beforeEach(() =>
      mocked(printLiteralExpression).mockReturnValue(
        ['{', `  ${nameof(printLiteralExpression)}`, '}'].join('\n')
      )
    );

    it('prints the opening brace on the first line', () => {
      expect(
        printArgument(
          makeTFArgument('name', {
            type: TFNodeType.Map,
            attributes: [
              [
                'MyArray',
                [
                  'aws_subnet.public_a.id',
                  'aws_subnet.public_b.id',
                  'aws_subnet.public_c.id'
                ]
              ]
            ]
          })
        )
      ).toMatchSnapshot();
    });
  });
});
