import { makeTFLabel } from '@src/makers';
import { StringCursor, parseTFBlock } from '@src/parser';
import dedent from 'dedent';

describe('parseTFBlock', () => {
  it('collects leading outer comments', () => {
    const { leadingOuterText } = parseTFBlock(
      new StringCursor(dedent`
        # hello world
        resource "aws_route53_zone" "my_zone" {
          name = "example.com"
        }
      `)
    ).surroundingText;

    expect(leadingOuterText).toBe('# hello world\n');
  });

  it('parses label-less blocks', () => {
    expect(
      parseTFBlock(
        new StringCursor(dedent`
          atlas {
            name = "hello world"
          }
        `)
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
                "type": "Simple",
                "value": "\\"hello world\\"",
              },
              "identifier": Object {
                "surroundingText": Object {
                  "leadingOuterText": "
        ",
                  "trailingOuterText": "",
                },
                "type": "Identifier",
                "value": "name",
              },
              "surroundingText": Object {
                "leadingInnerText": " ",
                "trailingInnerText": "",
              },
              "type": "Argument",
            },
          ],
          "surroundingText": Object {
            "leadingInnerText": "",
            "leadingOuterText": " ",
            "trailingInnerText": "
      ",
            "trailingOuterText": "",
          },
          "type": "Body",
        },
        "labels": Array [],
        "surroundingText": Object {
          "leadingOuterText": "",
          "trailingOuterText": "",
        },
        "type": "Block",
      }
    `);
  });

  it('parses labels', () => {
    const { labels } = parseTFBlock(
      new StringCursor(dedent`
        module "my_module" {
          source = "../../my_module"
        }
      `)
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
      new StringCursor(dedent`
        resource ${expectedLabels.map(label => label.value).join(' ')} {
          name = "hello world"
        }
      `)
    );

    expect(labels).toStrictEqual(expectedLabels);
  });
});
