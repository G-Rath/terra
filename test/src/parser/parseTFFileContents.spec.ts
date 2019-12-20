import * as parser from '@src/parser';
import { parseTFFileContents } from '@src/parser';
import { TFFileContents } from '@src/types';
import * as fs from 'fs';
import { mocked } from 'ts-jest/utils';

jest.mock('fs');
const fsMock = mocked(fs);

describe('parseTFFileContents', () => {
  describe('when the contents contain nothing', () => {
    it('returns empty', () => {
      const contents = parseTFFileContents('');

      expect(contents).toStrictEqual<TFFileContents>({
        blocks: [],
        surroundingText: {
          leadingOuterText: '',
          trailingOuterText: ''
        }
      });
    });
  });

  describe('when the contents contain only comments', () => {
    it('parses the comments as trailingOuterText', () => {
      const {
        leadingOuterText, //
        trailingOuterText
      } = parseTFFileContents('/* hello world */').surroundingText;

      expect(leadingOuterText).toBe('');
      expect(trailingOuterText).toBe('/* hello world */');
    });

    it('parses no blocks', () => {
      const { blocks } = parseTFFileContents('/* hello world */');

      expect(blocks).toHaveLength(0);
    });
  });

  describe('when the contents contain only blocks', () => {
    it('has no surroundingText', () => {
      const {
        leadingOuterText, //
        trailingOuterText
      } = parseTFFileContents(
        `
resource "aws_route53_zone" my_zone {
  name = "example.com"
}
`.trim()
      ).surroundingText;

      expect(leadingOuterText).toBe('');
      expect(trailingOuterText).toBe('');
    });

    it('parses the blocks', () => {
      const { blocks } = parseTFFileContents(
        `
resource "aws_route53_zone" my_zone {
  name = "example.com"
}
`.trim()
      );

      expect(blocks).toMatchInlineSnapshot(`
        Array [
          Object {
            "blockType": "resource",
            "body": Object {
              "body": Array [
                Object {
                  "expression": Object {
                    "surroundingText": Object {
                      "leadingOuterText": " ",
                      "trailingOuterText": "",
                    },
                    "type": "simple",
                    "value": "\\"example.com\\"",
                  },
                  "identifier": "name",
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
            "labels": Array [
              Object {
                "surroundingText": Object {
                  "leadingOuterText": " ",
                  "trailingOuterText": "",
                },
                "type": "label",
                "value": "\\"aws_route53_zone\\"",
              },
              Object {
                "surroundingText": Object {
                  "leadingOuterText": " ",
                  "trailingOuterText": "",
                },
                "type": "label",
                "value": "my_zone",
              },
            ],
            "surroundingText": Object {
              "leadingOuterText": "",
              "trailingOuterText": "",
            },
            "type": "block",
          },
        ]
      `);
    });
  });

  describe('when the contents contain both blocks and comments', () => {
    it('parses the surroundingText', () => {
      const { surroundingText } = parseTFFileContents(
        `
# This is the hosted zone for the zone that I own
resource "aws_route53_zone" my_zone {
  name = "example.com"
}
`.trim()
      );

      expect(surroundingText).toMatchInlineSnapshot(`
        Object {
          "leadingOuterText": "",
          "trailingOuterText": "",
        }
      `);
    });

    it('parses the blocks', () => {
      const { blocks } = parseTFFileContents(
        `
# This is the hosted zone for the zone that I own
resource "aws_route53_zone" my_zone {
  name = "example.com"
}
`.trim()
      );

      expect(blocks).toMatchInlineSnapshot(`
        Array [
          Object {
            "blockType": "resource",
            "body": Object {
              "body": Array [
                Object {
                  "expression": Object {
                    "surroundingText": Object {
                      "leadingOuterText": " ",
                      "trailingOuterText": "",
                    },
                    "type": "simple",
                    "value": "\\"example.com\\"",
                  },
                  "identifier": "name",
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
            "labels": Array [
              Object {
                "surroundingText": Object {
                  "leadingOuterText": " ",
                  "trailingOuterText": "",
                },
                "type": "label",
                "value": "\\"aws_route53_zone\\"",
              },
              Object {
                "surroundingText": Object {
                  "leadingOuterText": " ",
                  "trailingOuterText": "",
                },
                "type": "label",
                "value": "my_zone",
              },
            ],
            "surroundingText": Object {
              "leadingOuterText": "# This is the hosted zone for the zone that I own
        ",
              "trailingOuterText": "",
            },
            "type": "block",
          },
        ]
      `);
    });
  });

  describe('when the "record" parameter is "true"', () => {
    it('writes recordings of successfully parses to disk', () => {
      parseTFFileContents(
        `
# This is the hosted zone for the zone that I own
resource "aws_route53_zone" my_zone {
  name = "example.com"
}
`.trim(),
        true
      );

      expect(fsMock.writeFileSync).toHaveBeenCalledWith(
        expect.stringMatching(/\.json$/),
        expect.any(String)
      );
    });

    it('writes recordings of errored parses to disk', () => {
      jest.spyOn(parser, 'parseTFBlock').mockImplementation(() => {
        throw new Error('error!');
      });

      expect(() =>
        parseTFFileContents(
          `
# This is the hosted zone for the zone that I own
resource "aws_route53_zone" my_zone {
  name = "example.com"
}
`.trim(),
          true
        )
      ).toThrow('error!');

      expect(fsMock.writeFileSync).toHaveBeenCalledWith(
        expect.stringMatching(/\.json$/),
        expect.any(String)
      );
    });
  });

  describe('when the "record" parameter is "false"', () => {
    it('does not write recordings of successfully parses to disk', () => {
      parseTFFileContents(
        `
# This is the hosted zone for the zone that I own
resource "aws_route53_zone" my_zone {
  name = "example.com"
}
`.trim(),
        false
      );

      expect(fsMock.writeFileSync).not.toHaveBeenCalled();
    });

    it('does not write recordings of errored parses to disk', () => {
      jest.spyOn(parser, 'parseTFBlock').mockImplementation(() => {
        throw new Error('error!');
      });

      expect(() =>
        parseTFFileContents(
          `
# This is the hosted zone for the zone that I own
resource "aws_route53_zone" my_zone {
  name = "example.com"
}
`.trim(),
          false
        )
      ).toThrow('error!');

      expect(fsMock.writeFileSync).not.toHaveBeenCalled();
    });
  });
});
