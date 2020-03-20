import { ensureClosingBraceOnNewline } from '@src/formatter';
import { makeFormatter } from '@test/helpers';

describe('ensureClosingBraceOnNewline', () => {
  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(ensureClosingBraceOnNewline([])).toStrictEqual([]);
    });
  });

  it('formats Map and Body nodes', () => {
    expect(
      makeFormatter(ensureClosingBraceOnNewline)(
        'locals { map = { key = value } }'
      )
    ).toMatchInlineSnapshot(`
      "locals { map = { key = value
       }
       }"
    `);
  });

  it('handles trailing commas', () => {
    expect(
      makeFormatter(ensureClosingBraceOnNewline)(
        'locals { map = { key = value, } }'
      )
    ).toMatchInlineSnapshot(`
      "locals { map = { key = value,
       }
       }"
    `);
  });

  describe('when closing braces are already on a newline', () => {
    it('leaves them be', () => {
      expect(
        makeFormatter(ensureClosingBraceOnNewline)(`
          locals {
            map = {
              key = value
            }
          }
        `)
      ).toMatchInlineSnapshot(`
        "locals {
          map = {
            key = value
          }
        }"
      `);
    });
  });
});
