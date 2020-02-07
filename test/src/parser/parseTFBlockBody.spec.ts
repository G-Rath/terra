import { StringCursor, parseTFBlockBody } from '@src/parser';
import dedent from 'dedent';

describe('parseTFBlockBody', () => {
  describe('leadingOuterText', () => {
    it('collects leading outer comments', () => {
      const { leadingOuterText } = parseTFBlockBody(
        new StringCursor(dedent`
          /* hello world */ {
            name = "hello world"
          }
        `)
      ).surroundingText;

      expect(leadingOuterText).toBe('/* hello world */ ');
    });
  });

  it('parses arguments', () => {
    const body = parseTFBlockBody(
      new StringCursor(dedent`
        /* hello world */ {
          name = "hello world"
        }
      `)
    );

    expect(body.body).toHaveLength(1);
    expect(body).toContainTFArgument('name');
  });

  it('parses blocks', () => {
    const body = parseTFBlockBody(
      new StringCursor(dedent`
        /* hello world */ {
          ingress {
            name = "hello world"
          }
        }
      `)
    );

    expect(body.body).toHaveLength(1);
    expect(body).toContainTFBlock('ingress');
  });

  describe('trailingInnerText', () => {
    it('collects trailing inner comments', () => {
      const { trailingInnerText } = parseTFBlockBody(
        new StringCursor(dedent`
          {
            name = "hello world"
            /* hello world */
          }
        `)
      ).surroundingText;

      expect(trailingInnerText).toMatchInlineSnapshot(`
        "
          /* hello world */
        "
      `);
    });
  });
});
