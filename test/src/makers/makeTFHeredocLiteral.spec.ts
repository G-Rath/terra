import { makeTFHeredocLiteral } from '@src/makers';
import { TFHeredocLiteral, TFNodeType } from '@src/types';
import dedent from 'dedent';

describe('makeTFHeredocLiteral', () => {
  it('makes a makeTFHeredocLiteral', () => {
    expect(
      makeTFHeredocLiteral(
        'EOF',
        dedent`
          hello
          world
        `,
        false,
        {
          trailingInnerText: '    '
        }
      )
    ).toStrictEqual<TFHeredocLiteral>({
      type: TFNodeType.Heredoc,
      delimiter: 'EOF',
      content: dedent`
        hello
        world
       `,
      indented: false,
      surroundingText: {
        leadingOuterText: '',
        leadingInnerText: '\n',
        trailingInnerText: '    ',
        trailingOuterText: ''
      }
    });
  });
});
