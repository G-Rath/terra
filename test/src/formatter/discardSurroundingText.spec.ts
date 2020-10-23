import { discardSurroundingText } from '@src/formatter';
import { parseTFFileContents } from '@src/parser';
import dedent from 'dedent';

const extractSurroundingText = (contents: object): object =>
  JSON.parse(
    JSON.stringify(
      contents,
      (key, value: unknown) =>
        [
          'surroundingText',
          'leadingInnerText',
          'trailingInnerText',
          'leadingOuterText',
          'trailingOuterText'
        ].includes(key) ||
        (typeof value === 'object' && (!Array.isArray(value) || value.length))
          ? value
          : undefined,
      2
    )
  ) as object;

describe('discardSurroundingText', () => {
  describe('behaviours', () => {
    const input = parseTFFileContents(dedent`
      # local variables
      locals {
        env_name = "production"

        common_tags = {
          client = "mine"
          env    = local.env_name
        }
      }
    `);

    describe('"except-comments-and-newlines" discard behaviour', () => {
      it('discards surrounding text except when the text contains comments or newlines', () => {
        const parsedInput = discardSurroundingText(
          input,
          'except-comments-and-newlines'
        );

        expect(extractSurroundingText(parsedInput)).toMatchInlineSnapshot(`
          Object {
            "blocks": Array [
              Object {
                "body": Object {
                  "body": Array [
                    Object {
                      "expression": Object {
                        "surroundingText": Object {
                          "leadingOuterText": "",
                          "trailingOuterText": "",
                        },
                      },
                      "identifier": Object {
                        "surroundingText": Object {
                          "leadingOuterText": "
            ",
                          "trailingOuterText": "",
                        },
                      },
                      "surroundingText": Object {
                        "leadingInnerText": "",
                        "trailingInnerText": "",
                      },
                    },
                    Object {
                      "expression": Object {
                        "attributes": Array [
                          Object {
                            "key": Object {
                              "surroundingText": Object {
                                "leadingOuterText": "
              ",
                                "trailingOuterText": "",
                              },
                            },
                            "surroundingText": Object {
                              "leadingInnerText": "",
                              "trailingInnerText": "",
                            },
                            "value": Object {
                              "surroundingText": Object {
                                "leadingOuterText": "",
                                "trailingOuterText": "",
                              },
                            },
                          },
                          Object {
                            "key": Object {
                              "surroundingText": Object {
                                "leadingOuterText": "
              ",
                                "trailingOuterText": "",
                              },
                            },
                            "surroundingText": Object {
                              "leadingInnerText": "",
                              "trailingInnerText": "",
                            },
                            "value": Object {
                              "surroundingText": Object {
                                "leadingOuterText": "",
                                "trailingOuterText": "",
                              },
                            },
                          },
                        ],
                        "surroundingText": Object {
                          "leadingInnerText": "",
                          "leadingOuterText": "",
                          "trailingInnerText": "
            ",
                          "trailingOuterText": "",
                        },
                      },
                      "identifier": Object {
                        "surroundingText": Object {
                          "leadingOuterText": "

            ",
                          "trailingOuterText": "",
                        },
                      },
                      "surroundingText": Object {
                        "leadingInnerText": "",
                        "trailingInnerText": "",
                      },
                    },
                  ],
                  "surroundingText": Object {
                    "leadingInnerText": "",
                    "leadingOuterText": "",
                    "trailingInnerText": "
          ",
                    "trailingOuterText": "",
                  },
                },
                "surroundingText": Object {
                  "leadingOuterText": "# local variables
          ",
                  "trailingOuterText": "",
                },
              },
            ],
            "surroundingText": Object {
              "leadingOuterText": "",
              "trailingOuterText": "",
            },
          }
        `);
      });
    });

    describe('"except-comments" discard behaviour', () => {
      it('discards surrounding text except when the text contains comments', () => {
        const parsedInput = discardSurroundingText(input, 'except-comments');

        expect(extractSurroundingText(parsedInput)).toMatchInlineSnapshot(`
          Object {
            "blocks": Array [
              Object {
                "body": Object {
                  "body": Array [
                    Object {
                      "expression": Object {
                        "surroundingText": Object {
                          "leadingOuterText": "",
                          "trailingOuterText": "",
                        },
                      },
                      "identifier": Object {
                        "surroundingText": Object {
                          "leadingOuterText": "",
                          "trailingOuterText": "",
                        },
                      },
                      "surroundingText": Object {
                        "leadingInnerText": "",
                        "trailingInnerText": "",
                      },
                    },
                    Object {
                      "expression": Object {
                        "attributes": Array [
                          Object {
                            "key": Object {
                              "surroundingText": Object {
                                "leadingOuterText": "",
                                "trailingOuterText": "",
                              },
                            },
                            "surroundingText": Object {
                              "leadingInnerText": "",
                              "trailingInnerText": "",
                            },
                            "value": Object {
                              "surroundingText": Object {
                                "leadingOuterText": "",
                                "trailingOuterText": "",
                              },
                            },
                          },
                          Object {
                            "key": Object {
                              "surroundingText": Object {
                                "leadingOuterText": "",
                                "trailingOuterText": "",
                              },
                            },
                            "surroundingText": Object {
                              "leadingInnerText": "",
                              "trailingInnerText": "",
                            },
                            "value": Object {
                              "surroundingText": Object {
                                "leadingOuterText": "",
                                "trailingOuterText": "",
                              },
                            },
                          },
                        ],
                        "surroundingText": Object {
                          "leadingInnerText": "",
                          "leadingOuterText": "",
                          "trailingInnerText": "",
                          "trailingOuterText": "",
                        },
                      },
                      "identifier": Object {
                        "surroundingText": Object {
                          "leadingOuterText": "",
                          "trailingOuterText": "",
                        },
                      },
                      "surroundingText": Object {
                        "leadingInnerText": "",
                        "trailingInnerText": "",
                      },
                    },
                  ],
                  "surroundingText": Object {
                    "leadingInnerText": "",
                    "leadingOuterText": "",
                    "trailingInnerText": "",
                    "trailingOuterText": "",
                  },
                },
                "surroundingText": Object {
                  "leadingOuterText": "# local variables
          ",
                  "trailingOuterText": "",
                },
              },
            ],
            "surroundingText": Object {
              "leadingOuterText": "",
              "trailingOuterText": "",
            },
          }
        `);
      });
    });

    describe('"all" discard behaviour', () => {
      it('discards all surroundingText', () => {
        const parsedInput = discardSurroundingText(input, 'all');

        expect(extractSurroundingText(parsedInput)).toMatchInlineSnapshot(`
          Object {
            "blocks": Array [
              Object {
                "body": Object {
                  "body": Array [
                    Object {
                      "expression": Object {
                        "surroundingText": Object {
                          "leadingOuterText": "",
                          "trailingOuterText": "",
                        },
                      },
                      "identifier": Object {
                        "surroundingText": Object {
                          "leadingOuterText": "",
                          "trailingOuterText": "",
                        },
                      },
                      "surroundingText": Object {
                        "leadingInnerText": "",
                        "trailingInnerText": "",
                      },
                    },
                    Object {
                      "expression": Object {
                        "attributes": Array [
                          Object {
                            "key": Object {
                              "surroundingText": Object {
                                "leadingOuterText": "",
                                "trailingOuterText": "",
                              },
                            },
                            "surroundingText": Object {
                              "leadingInnerText": "",
                              "trailingInnerText": "",
                            },
                            "value": Object {
                              "surroundingText": Object {
                                "leadingOuterText": "",
                                "trailingOuterText": "",
                              },
                            },
                          },
                          Object {
                            "key": Object {
                              "surroundingText": Object {
                                "leadingOuterText": "",
                                "trailingOuterText": "",
                              },
                            },
                            "surroundingText": Object {
                              "leadingInnerText": "",
                              "trailingInnerText": "",
                            },
                            "value": Object {
                              "surroundingText": Object {
                                "leadingOuterText": "",
                                "trailingOuterText": "",
                              },
                            },
                          },
                        ],
                        "surroundingText": Object {
                          "leadingInnerText": "",
                          "leadingOuterText": "",
                          "trailingInnerText": "",
                          "trailingOuterText": "",
                        },
                      },
                      "identifier": Object {
                        "surroundingText": Object {
                          "leadingOuterText": "",
                          "trailingOuterText": "",
                        },
                      },
                      "surroundingText": Object {
                        "leadingInnerText": "",
                        "trailingInnerText": "",
                      },
                    },
                  ],
                  "surroundingText": Object {
                    "leadingInnerText": "",
                    "leadingOuterText": "",
                    "trailingInnerText": "",
                    "trailingOuterText": "",
                  },
                },
                "surroundingText": Object {
                  "leadingOuterText": "",
                  "trailingOuterText": "",
                },
              },
            ],
            "surroundingText": Object {
              "leadingOuterText": "",
              "trailingOuterText": "",
            },
          }
        `);
      });
    });
  });
});
