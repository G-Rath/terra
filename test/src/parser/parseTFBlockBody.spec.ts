import { parseTFBlockBody, StringCursor } from '@src/parser';

describe('parseTFBlockBody', () => {
  describe('leadingOuterText', () => {
    it('collects leading outer comments', () => {
      const { leadingOuterText } = parseTFBlockBody(
        new StringCursor(
          `
/* hello world */ {
  name = "hello world"
}
      `.trim()
        )
      ).surroundingText;

      expect(leadingOuterText).toBe('/* hello world */ ');
    });
  });

  it('parses arguments', () => {
    const body = parseTFBlockBody(
      new StringCursor(
        `
/* hello world */ {
  name = "hello world"
}
      `.trim()
      )
    );

    expect(body.body).toHaveLength(1);
    expect(body).toContainTFArgument('name');
  });

  it('parses blocks', () => {
    const body = parseTFBlockBody(
      new StringCursor(
        `
/* hello world */ {
  ingress {
    name = "hello world"
  }
}
      `.trim()
      )
    );

    expect(body.body).toHaveLength(1);
    expect(body).toContainTFBlock('ingress');
  });

  describe('trailingInnerText', () => {
    it('collects trailing inner comments', () => {
      const { trailingInnerText } = parseTFBlockBody(
        new StringCursor(
          `
{
  name = "hello world"
  /* hello world */
}
      `.trim()
        )
      ).surroundingText;

      expect(trailingInnerText).toBe(`
  /* hello world */
`);
    });
  });
});
