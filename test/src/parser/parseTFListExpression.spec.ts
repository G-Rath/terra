import { StringCursor, parseTFListExpression } from '@src/parser';
import dedent from 'dedent';

describe('parseTFListExpression', () => {
  describe('leading text', () => {
    it('collects up to the opening square bracket', () => {
      const { leadingOuterText } = parseTFListExpression(
        new StringCursor(' [ "hello world" ] ')
      ).surroundingText;

      expect(leadingOuterText).toBe(' ');
    });

    it('preserves comments', () => {
      const { leadingOuterText } = parseTFListExpression(
        new StringCursor(' /* [ hello world ] */ [ "hello world" ] ')
      ).surroundingText;

      expect(leadingOuterText).toBe(' /* [ hello world ] */ ');
    });
  });

  describe('values text', () => {
    it('parses empty lists', () => {
      expect(parseTFListExpression(new StringCursor('[]')))
        .toMatchInlineSnapshot(`
        Object {
          "hasTrailingComma": false,
          "surroundingText": Object {
            "leadingInnerText": "",
            "leadingOuterText": "",
            "trailingInnerText": "",
            "trailingOuterText": "",
          },
          "type": "List",
          "values": Array [],
        }
      `);
    });

    it('parses a single value single line list correctly', () => {
      expect(parseTFListExpression(new StringCursor('["hello world"] ')))
        .toMatchInlineSnapshot(`
        Object {
          "hasTrailingComma": false,
          "surroundingText": Object {
            "leadingInnerText": "",
            "leadingOuterText": "",
            "trailingInnerText": "",
            "trailingOuterText": "",
          },
          "type": "List",
          "values": Array [
            Object {
              "surroundingText": Object {
                "leadingOuterText": "",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "\\"hello world\\"",
            },
          ],
        }
      `);
    });

    it('parses a single value multi-line list correctly', () => {
      expect(
        parseTFListExpression(
          new StringCursor(dedent`
            [
              "hello world"
            ]
          `)
        )
      ).toMatchInlineSnapshot(`
        Object {
          "hasTrailingComma": false,
          "surroundingText": Object {
            "leadingInnerText": "",
            "leadingOuterText": "",
            "trailingInnerText": "
        ",
            "trailingOuterText": "",
          },
          "type": "List",
          "values": Array [
            Object {
              "surroundingText": Object {
                "leadingOuterText": "
          ",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "\\"hello world\\"",
            },
          ],
        }
      `);
    });

    it('parses trailing comma', () => {
      expect(parseTFListExpression(new StringCursor('[1, 2, 3,] ')))
        .toMatchInlineSnapshot(`
        Object {
          "hasTrailingComma": true,
          "surroundingText": Object {
            "leadingInnerText": "",
            "leadingOuterText": "",
            "trailingInnerText": "",
            "trailingOuterText": "",
          },
          "type": "List",
          "values": Array [
            Object {
              "surroundingText": Object {
                "leadingOuterText": "",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "1",
            },
            Object {
              "surroundingText": Object {
                "leadingOuterText": " ",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "2",
            },
            Object {
              "surroundingText": Object {
                "leadingOuterText": " ",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "3",
            },
          ],
        }
      `);
    });

    it('parses comments before the comma', () => {
      expect(
        parseTFListExpression(
          new StringCursor('[ hello/* world */, sunshine] ')
        )
      ).toMatchInlineSnapshot(`
        Object {
          "hasTrailingComma": false,
          "surroundingText": Object {
            "leadingInnerText": "",
            "leadingOuterText": "",
            "trailingInnerText": "",
            "trailingOuterText": "",
          },
          "type": "List",
          "values": Array [
            Object {
              "surroundingText": Object {
                "leadingOuterText": " ",
                "trailingOuterText": "/* world */",
              },
              "type": "Simple",
              "value": "hello",
            },
            Object {
              "surroundingText": Object {
                "leadingOuterText": " ",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "sunshine",
            },
          ],
        }
      `);
    });

    it('parses function elements properly', () => {
      expect(parseTFListExpression(new StringCursor('[1, min(2, 3, 4), 5]')))
        .toMatchInlineSnapshot(`
        Object {
          "hasTrailingComma": false,
          "surroundingText": Object {
            "leadingInnerText": "",
            "leadingOuterText": "",
            "trailingInnerText": "",
            "trailingOuterText": "",
          },
          "type": "List",
          "values": Array [
            Object {
              "surroundingText": Object {
                "leadingOuterText": "",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "1",
            },
            Object {
              "args": Array [
                Object {
                  "surroundingText": Object {
                    "leadingOuterText": "",
                    "trailingOuterText": "",
                  },
                  "type": "Simple",
                  "value": "2",
                },
                Object {
                  "surroundingText": Object {
                    "leadingOuterText": " ",
                    "trailingOuterText": "",
                  },
                  "type": "Simple",
                  "value": "3",
                },
                Object {
                  "surroundingText": Object {
                    "leadingOuterText": " ",
                    "trailingOuterText": "",
                  },
                  "type": "Simple",
                  "value": "4",
                },
              ],
              "hasTrailingComma": false,
              "name": Object {
                "surroundingText": Object {
                  "leadingOuterText": " ",
                  "trailingOuterText": "",
                },
                "type": "Identifier",
                "value": "min",
              },
              "surroundingText": Object {
                "leadingInnerText": "",
                "leadingOuterText": "",
                "trailingInnerText": "",
                "trailingOuterText": "",
              },
              "type": "Function",
            },
            Object {
              "surroundingText": Object {
                "leadingOuterText": " ",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "5",
            },
          ],
        }
      `);
    });

    it('parses comments between elements', () => {
      expect(
        parseTFListExpression(
          new StringCursor(dedent`
            [
              "hello",
              // world
              "hello",
              # sunshine
            ]
          `)
        )
      ).toMatchInlineSnapshot(`
        Object {
          "hasTrailingComma": true,
          "surroundingText": Object {
            "leadingInnerText": "",
            "leadingOuterText": "",
            "trailingInnerText": "
          # sunshine
        ",
            "trailingOuterText": "",
          },
          "type": "List",
          "values": Array [
            Object {
              "surroundingText": Object {
                "leadingOuterText": "
          ",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "\\"hello\\"",
            },
            Object {
              "surroundingText": Object {
                "leadingOuterText": "
          // world
          ",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "\\"hello\\"",
            },
          ],
        }
      `);
    });
  });

  describe('inner trailing text', () => {
    it('collects up to the closing square bracket', () => {
      const { trailingInnerText } = parseTFListExpression(
        new StringCursor('[ "hello world" ] ')
      ).surroundingText;

      expect(trailingInnerText).toBe(' ');
    });

    it('collects over multiple lines', () => {
      const { trailingInnerText } = parseTFListExpression(
        new StringCursor(dedent`
          [
            "hello world"
            /* hello world */
            // hello sunshine
          ]
        `)
      ).surroundingText;

      expect(trailingInnerText).toMatchInlineSnapshot(`
        "
          /* hello world */
          // hello sunshine
        "
      `);
    });

    it('includes comments', () => {
      const { trailingInnerText } = parseTFListExpression(
        new StringCursor('[ "hello world" /* hello world */ ] ')
      ).surroundingText;

      expect(trailingInnerText).toBe(' /* hello world */ ');
    });
  });
});
