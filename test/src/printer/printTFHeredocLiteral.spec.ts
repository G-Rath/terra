import { makeTFHeredocLiteral } from '@src/makers';
import { printTFHeredocLiteral } from '@src/printer';

describe('printTFHeredocLiteral', () => {
  describe('when the heredoc literal is indented', () => {
    it('prints the correct syntax', () => {
      expect(
        printTFHeredocLiteral(
          makeTFHeredocLiteral('EOF', '  hello\n  world', true)
        )
      ).toMatchInlineSnapshot(`
        "<<-EOF
          hello
          world
        EOF"
      `);
    });
  });

  describe('when the heredoc literal is not indented', () => {
    it('prints the correct syntax', () => {
      expect(
        printTFHeredocLiteral(
          makeTFHeredocLiteral('EOF', 'hello\nworld', false)
        )
      ).toMatchInlineSnapshot(`
        "<<EOF
        hello
        world
        EOF"
      `);
    });
  });

  it('prints inner whitespace as expected', () => {
    expect(
      printTFHeredocLiteral(
        makeTFHeredocLiteral('EOF', 'hello\n  world', false, {
          trailingInnerText: '\n    '
        })
      )
    ).toMatchInlineSnapshot(`
      "<<EOF
      hello
        world
          EOF"
    `);
  });
});
