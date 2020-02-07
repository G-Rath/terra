import * as parser from '@src/parser';
import { parseTFFileContents } from '@src/parser';
import { TFFileContents } from '@src/types';
import dedent from 'dedent';
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
      } = parseTFFileContents(dedent`
        resource "aws_route53_zone" my_zone {
          name = "example.com"
        }
      `).surroundingText;

      expect(leadingOuterText).toBe('');
      expect(trailingOuterText).toBe('');
    });

    it('parses the blocks', () => {
      const { blocks } = parseTFFileContents(dedent`
        resource "aws_route53_zone" my_zone {
          name = "example.com"
        }
      `);

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
                    "type": "Simple",
                    "value": "\\"example.com\\"",
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
            "labels": Array [
              Object {
                "surroundingText": Object {
                  "leadingOuterText": " ",
                  "trailingOuterText": "",
                },
                "type": "Label",
                "value": "\\"aws_route53_zone\\"",
              },
              Object {
                "surroundingText": Object {
                  "leadingOuterText": " ",
                  "trailingOuterText": "",
                },
                "type": "Label",
                "value": "my_zone",
              },
            ],
            "surroundingText": Object {
              "leadingOuterText": "",
              "trailingOuterText": "",
            },
            "type": "Block",
          },
        ]
      `);
    });
  });

  describe('when the contents contain both blocks and comments', () => {
    it('parses the surroundingText', () => {
      const { surroundingText } = parseTFFileContents(dedent`
        # This is the hosted zone for the zone that I own
        resource "aws_route53_zone" my_zone {
          name = "example.com"
        }
      `);

      expect(surroundingText).toMatchInlineSnapshot(`
        Object {
          "leadingOuterText": "",
          "trailingOuterText": "",
        }
      `);
    });

    it('parses the blocks', () => {
      const { blocks } = parseTFFileContents(dedent`
        # This is the hosted zone for the zone that I own
        resource "aws_route53_zone" my_zone {
          name = "example.com"
        }
      `);

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
                    "type": "Simple",
                    "value": "\\"example.com\\"",
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
            "labels": Array [
              Object {
                "surroundingText": Object {
                  "leadingOuterText": " ",
                  "trailingOuterText": "",
                },
                "type": "Label",
                "value": "\\"aws_route53_zone\\"",
              },
              Object {
                "surroundingText": Object {
                  "leadingOuterText": " ",
                  "trailingOuterText": "",
                },
                "type": "Label",
                "value": "my_zone",
              },
            ],
            "surroundingText": Object {
              "leadingOuterText": "# This is the hosted zone for the zone that I own
        ",
              "trailingOuterText": "",
            },
            "type": "Block",
          },
        ]
      `);
    });
  });

  describe('when the "record" parameter is "true"', () => {
    it('writes recordings of successfully parses to disk', () => {
      parseTFFileContents(
        dedent`
          # This is the hosted zone for the zone that I own
          resource "aws_route53_zone" my_zone {
            name = "example.com"
          }
        `,
        true
      );

      expect(fsMock.writeFileSync).toHaveBeenCalledWith(
        expect.stringMatching(/\.json$/u),
        expect.any(String)
      );
    });

    it('writes recordings of errored parses to disk', () => {
      jest.spyOn(parser, 'parseTFBlock').mockImplementation(() => {
        throw new Error('error!');
      });

      expect(() =>
        parseTFFileContents(
          dedent`
            # This is the hosted zone for the zone that I own
            resource "aws_route53_zone" my_zone {
              name = "example.com"
            }
          `,
          true
        )
      ).toThrow('error!');

      expect(fsMock.writeFileSync).toHaveBeenCalledWith(
        expect.stringMatching(/\.json$/u),
        expect.any(String)
      );
    });
  });

  describe('when the "record" parameter is "false"', () => {
    it('does not write recordings of successfully parses to disk', () => {
      parseTFFileContents(
        dedent`
          # This is the hosted zone for the zone that I own
          resource "aws_route53_zone" my_zone {
            name = "example.com"
          }
        `,
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
          dedent`
            # This is the hosted zone for the zone that I own
            resource "aws_route53_zone" my_zone {
              name = "example.com"
            }
          `,
          false
        )
      ).toThrow('error!');

      expect(fsMock.writeFileSync).not.toHaveBeenCalled();
    });
  });
});
