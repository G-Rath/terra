import { StringCursor, parseTFHeredocLiteral } from '@src/parser';
import dedent from 'dedent';

describe('parseTFHeredocLiteral', () => {
  it('parses unintended syntax correctly', () => {
    expect(
      parseTFHeredocLiteral(
        new StringCursor(dedent`
          <<EOF
          hello
          world
          EOF
          \n
        `)
      )
    ).toMatchInlineSnapshot(`
      Object {
        "content": "hello
      world",
        "delimiter": "EOF",
        "indented": false,
        "surroundingText": Object {
          "leadingInnerText": "
      ",
          "leadingOuterText": "",
          "trailingInnerText": "
      ",
          "trailingOuterText": "
      ",
        },
        "type": "Heredoc",
      }
    `);
  });

  it('parses indented syntax correctly', () => {
    expect(
      parseTFHeredocLiteral(
        new StringCursor(dedent`
          <<-EOF
          hello
            world
          EOF
          \n
        `)
      )
    ).toMatchInlineSnapshot(`
      Object {
        "content": "hello
        world",
        "delimiter": "EOF",
        "indented": true,
        "surroundingText": Object {
          "leadingInnerText": "
      ",
          "leadingOuterText": "",
          "trailingInnerText": "
      ",
          "trailingOuterText": "
      ",
        },
        "type": "Heredoc",
      }
    `);
  });

  it('parses text before the << arrows as leading outer text', () => {
    expect(
      parseTFHeredocLiteral(
        new StringCursor(dedent`
          /* hello world */ <<EOF
            hello
              world
                EOF
          \n
        `)
      )
    ).toMatchInlineSnapshot(`
      Object {
        "content": "  hello
          world",
        "delimiter": "EOF",
        "indented": false,
        "surroundingText": Object {
          "leadingInnerText": "
      ",
          "leadingOuterText": "/* hello world */ ",
          "trailingInnerText": "
            ",
          "trailingOuterText": "
      ",
        },
        "type": "Heredoc",
      }
    `);
  });

  it('parses text after the delimiter until the next newline as leading inner text', () => {
    expect(
      parseTFHeredocLiteral(
        new StringCursor(dedent`
          <<EOF /* this is not valid syntax, but we parse it anyway b/c we can */
            hello
              world
                EOF
          \n
        `)
      )
    ).toMatchInlineSnapshot(`
      Object {
        "content": "  hello
          world",
        "delimiter": "EOF",
        "indented": false,
        "surroundingText": Object {
          "leadingInnerText": " /* this is not valid syntax, but we parse it anyway b/c we can */
      ",
          "leadingOuterText": "",
          "trailingInnerText": "
            ",
          "trailingOuterText": "
      ",
        },
        "type": "Heredoc",
      }
    `);
  });

  it('parses long delimiter words', () => {
    expect(
      parseTFHeredocLiteral(
        new StringCursor(dedent`
          <<-ThisIsMyMarkerForTheEndOfThisHereDoc
            hello
              world
                ThisIsMyMarkerForTheEndOfThisHereDoc
          \n
        `)
      )
    ).toMatchInlineSnapshot(`
      Object {
        "content": "  hello
          world",
        "delimiter": "ThisIsMyMarkerForTheEndOfThisHereDoc",
        "indented": true,
        "surroundingText": Object {
          "leadingInnerText": "
      ",
          "leadingOuterText": "",
          "trailingInnerText": "
            ",
          "trailingOuterText": "
      ",
        },
        "type": "Heredoc",
      }
    `);
  });

  it('parses whitespace before the closing delimiter as trailing outer text', () => {
    expect(
      parseTFHeredocLiteral(
        new StringCursor(dedent`
          <<EOF
            hello
              world
                EOF
          \n
        `)
      )
    ).toMatchInlineSnapshot(`
      Object {
        "content": "  hello
          world",
        "delimiter": "EOF",
        "indented": false,
        "surroundingText": Object {
          "leadingInnerText": "
      ",
          "leadingOuterText": "",
          "trailingInnerText": "
            ",
          "trailingOuterText": "
      ",
        },
        "type": "Heredoc",
      }
    `);
  });

  it('parses text after the closing delimiter until the next newline as trailing outer text', () => {
    expect(
      parseTFHeredocLiteral(
        new StringCursor(dedent`
          <<EOF
            hello
              world
                EOF /* this is not valid syntax, but we parse it anyway b/c we can */
          \n
          /* this is not part of the heredocs trailing outer text */
        `)
      )
    ).toMatchInlineSnapshot(`
      Object {
        "content": "  hello
          world",
        "delimiter": "EOF",
        "indented": false,
        "surroundingText": Object {
          "leadingInnerText": "
      ",
          "leadingOuterText": "",
          "trailingInnerText": "
            ",
          "trailingOuterText": " /* this is not valid syntax, but we parse it anyway b/c we can */
      ",
        },
        "type": "Heredoc",
      }
    `);
  });
});
