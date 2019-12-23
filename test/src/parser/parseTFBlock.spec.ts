import { makeTFLabel } from '@src/makers';
import { parseTFBlock, StringCursor } from '@src/parser';

describe('parseTFBlock', () => {
  it('collects leading outer comments', () => {
    const { leadingOuterText } = parseTFBlock(
      new StringCursor(
        `
# hello world
resource "aws_route53_zone" "my_zone" {
  name = "example.com"
}
      `.trim()
      )
    ).surroundingText;

    expect(leadingOuterText).toBe('# hello world\n');
  });

  it('parses label-less blocks', () => {
    expect(
      parseTFBlock(
        new StringCursor(
          `
atlas {
  name = "hello world"
}
      `.trim()
        )
      )
    ).toMatchInlineSnapshot(`
      Object {
        "blockType": "atlas",
        "body": Object {
          "body": Array [
            Object {
              "expression": Object {
                "surroundingText": Object {
                  "leadingOuterText": " ",
                  "trailingOuterText": "",
                },
                "type": "simple",
                "value": "\\"hello world\\"",
              },
              "identifier": Object {
                "surroundingText": Object {
                  "leadingOuterText": "
        ",
                  "trailingOuterText": "",
                },
                "type": "identifier",
                "value": "name",
              },
              "surroundingText": Object {
                "leadingInnerText": " ",
                "trailingInnerText": "",
              },
              "type": "argument",
            },
          ],
          "surroundingText": Object {
            "leadingInnerText": "",
            "leadingOuterText": " ",
            "trailingInnerText": "
      ",
            "trailingOuterText": "",
          },
          "type": "body",
        },
        "labels": Array [],
        "surroundingText": Object {
          "leadingOuterText": "",
          "trailingOuterText": "",
        },
        "type": "block",
      }
    `);
  });

  it('parses labels', () => {
    const { labels } = parseTFBlock(
      new StringCursor(
        `
module "my_module" {
  source = "../../my_module"
}
      `.trim()
      )
    );

    expect(labels).toStrictEqual([
      makeTFLabel('"my_module"', { leadingOuterText: ' ' })
    ]);
  });

  it('parses many labels', () => {
    const expectedLabels = Array(50)
      .fill(undefined)
      .map((v, i) => makeTFLabel(`label-${i}`, { leadingOuterText: ' ' }));

    const { labels } = parseTFBlock(
      new StringCursor(
        `
resource ${expectedLabels.map(label => label.value).join(' ')} {
  name = "hello world"
}
      `.trim()
      )
    );

    expect(labels).toStrictEqual(expectedLabels);
  });
});
