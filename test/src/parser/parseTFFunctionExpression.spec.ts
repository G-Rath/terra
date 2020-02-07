import { StringCursor, parseTFFunctionExpression } from '@src/parser';
import dedent from 'dedent';

describe('parseTFFunctionExpression', () => {
  it('parses the name as expected', () => {
    const { name } = parseTFFunctionExpression(new StringCursor('trim()'));

    expect(name).toMatchInlineSnapshot(`
      Object {
        "surroundingText": Object {
          "leadingOuterText": "",
          "trailingOuterText": "",
        },
        "type": "Identifier",
        "value": "trim",
      }
    `);
  });

  describe('leading text', () => {
    it('collects from the name to the opening parenthesis', () => {
      const { leadingOuterText } = parseTFFunctionExpression(
        new StringCursor('trim ()')
      ).surroundingText;

      expect(leadingOuterText).toBe(' ');
    });

    it('preserves comments', () => {
      const { leadingOuterText } = parseTFFunctionExpression(
        new StringCursor('trim/* hello world */()')
      ).surroundingText;

      expect(leadingOuterText).toBe('/* hello world */');
    });
  });

  describe('function arguments', () => {
    it('parses empty args', () => {
      expect(parseTFFunctionExpression(new StringCursor('date()')))
        .toMatchInlineSnapshot(`
        Object {
          "args": Array [],
          "hasTrailingComma": false,
          "name": Object {
            "surroundingText": Object {
              "leadingOuterText": "",
              "trailingOuterText": "",
            },
            "type": "Identifier",
            "value": "date",
          },
          "surroundingText": Object {
            "leadingInnerText": "",
            "leadingOuterText": "",
            "trailingInnerText": "",
            "trailingOuterText": "",
          },
          "type": "Function",
        }
      `);
    });

    it('parses trailing commas', () => {
      expect(
        parseTFFunctionExpression(new StringCursor('trim("hello", "world",)'))
      ).toMatchInlineSnapshot(`
        Object {
          "args": Array [
            Object {
              "surroundingText": Object {
                "leadingOuterText": "",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "\\"hello\\"",
            },
            Object {
              "surroundingText": Object {
                "leadingOuterText": " ",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "\\"world\\"",
            },
          ],
          "hasTrailingComma": true,
          "name": Object {
            "surroundingText": Object {
              "leadingOuterText": "",
              "trailingOuterText": "",
            },
            "type": "Identifier",
            "value": "trim",
          },
          "surroundingText": Object {
            "leadingInnerText": "",
            "leadingOuterText": "",
            "trailingInnerText": "",
            "trailingOuterText": "",
          },
          "type": "Function",
        }
      `);
    });

    it('parses comments before the comma', () => {
      expect(
        parseTFFunctionExpression(
          new StringCursor('max(1, 2/*hello*/, 3/*world*/,')
        )
      ).toMatchInlineSnapshot(`
        Object {
          "args": Array [
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
                "trailingOuterText": "/*hello*/",
              },
              "type": "Simple",
              "value": "2",
            },
            Object {
              "surroundingText": Object {
                "leadingOuterText": " ",
                "trailingOuterText": "/*world*/",
              },
              "type": "Simple",
              "value": "3",
            },
          ],
          "hasTrailingComma": true,
          "name": Object {
            "surroundingText": Object {
              "leadingOuterText": "",
              "trailingOuterText": "",
            },
            "type": "Identifier",
            "value": "max",
          },
          "surroundingText": Object {
            "leadingInnerText": "",
            "leadingOuterText": "",
            "trailingInnerText": " 3",
            "trailingOuterText": "",
          },
          "type": "Function",
        }
      `);
    });

    it('parses list args properly', () => {
      expect(
        parseTFFunctionExpression(
          new StringCursor('join(" ", ["hello", "world"])')
        )
      ).toMatchInlineSnapshot(`
        Object {
          "args": Array [
            Object {
              "surroundingText": Object {
                "leadingOuterText": "",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "\\" \\"",
            },
            Object {
              "hasTrailingComma": false,
              "surroundingText": Object {
                "leadingInnerText": "",
                "leadingOuterText": " ",
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
                  "value": "\\"hello\\"",
                },
                Object {
                  "surroundingText": Object {
                    "leadingOuterText": " ",
                    "trailingOuterText": "",
                  },
                  "type": "Simple",
                  "value": "\\"world\\"",
                },
              ],
            },
          ],
          "hasTrailingComma": false,
          "name": Object {
            "surroundingText": Object {
              "leadingOuterText": "",
              "trailingOuterText": "",
            },
            "type": "Identifier",
            "value": "join",
          },
          "surroundingText": Object {
            "leadingInnerText": "",
            "leadingOuterText": "",
            "trailingInnerText": "",
            "trailingOuterText": "",
          },
          "type": "Function",
        }
      `);
    });

    it('parses empty list args properly', () => {
      expect(parseTFFunctionExpression(new StringCursor('join(" ", [])')))
        .toMatchInlineSnapshot(`
        Object {
          "args": Array [
            Object {
              "surroundingText": Object {
                "leadingOuterText": "",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "\\" \\"",
            },
            Object {
              "hasTrailingComma": false,
              "surroundingText": Object {
                "leadingInnerText": "",
                "leadingOuterText": " ",
                "trailingInnerText": "",
                "trailingOuterText": "",
              },
              "type": "List",
              "values": Array [],
            },
          ],
          "hasTrailingComma": false,
          "name": Object {
            "surroundingText": Object {
              "leadingOuterText": "",
              "trailingOuterText": "",
            },
            "type": "Identifier",
            "value": "join",
          },
          "surroundingText": Object {
            "leadingInnerText": "",
            "leadingOuterText": "",
            "trailingInnerText": "",
            "trailingOuterText": "",
          },
          "type": "Function",
        }
      `);
    });

    it('parses comments between args', () => {
      expect(
        parseTFFunctionExpression(
          new StringCursor(dedent`
            max(
              1,
              // world
              2,
              # sunshine
            )
          `)
        )
      ).toMatchInlineSnapshot(`
        Object {
          "args": Array [
            Object {
              "surroundingText": Object {
                "leadingOuterText": "
          ",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "1",
            },
            Object {
              "surroundingText": Object {
                "leadingOuterText": "
          // world
          ",
                "trailingOuterText": "",
              },
              "type": "Simple",
              "value": "2",
            },
          ],
          "hasTrailingComma": true,
          "name": Object {
            "surroundingText": Object {
              "leadingOuterText": "",
              "trailingOuterText": "",
            },
            "type": "Identifier",
            "value": "max",
          },
          "surroundingText": Object {
            "leadingInnerText": "",
            "leadingOuterText": "",
            "trailingInnerText": "
          # sunshine
        ",
            "trailingOuterText": "",
          },
          "type": "Function",
        }
      `);
    });
  });

  describe('inner trailing text', () => {
    it('collects up to the closing parenthesis', () => {
      const { trailingInnerText } = parseTFFunctionExpression(
        new StringCursor('trim( "hello world" )')
      ).surroundingText;

      expect(trailingInnerText).toBe(' ');
    });

    it('collects over multiple lines', () => {
      const { trailingInnerText } = parseTFFunctionExpression(
        new StringCursor(dedent`
          trim(
            "hello world"
            /* hello world */
            // hello sunshine
          )
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
      const { trailingInnerText } = parseTFFunctionExpression(
        new StringCursor('trim("hello"/* world */)')
      ).surroundingText;

      expect(trailingInnerText).toBe('/* world */');
    });
  });
});
