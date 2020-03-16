import {
  Ensurer,
  ensureClosingBraceOnNewline,
  ensureIndentation,
  ensureLabelsHaveLeadingSpace,
  ensureNoSpacesAfterFunctionName,
  ensureSpaceBeforeOpeningBrace,
  ensureTopLevelBlocksAreSeparated
} from '@src/formatter';
import { parseTFFileContents } from '@src/parser';
import { printTFBlocks } from '@src/printer';
import { irlFixtures } from '@test/irlFixtures';
import dedent from 'dedent';

const makeFormatter = (ensurer: Ensurer) => (
  contents: string | TemplateStringsArray
): string => {
  const actualContents =
    typeof contents === 'string' ? contents : contents.raw.join('');

  return printTFBlocks(
    ensurer(parseTFFileContents(dedent(actualContents)).blocks)
  );
};

describe('ensureTopLevelBlocksAreSeparated', () => {
  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(ensureTopLevelBlocksAreSeparated([])).toStrictEqual([]);
    });
  });

  describe('when there is only one block', () => {
    it('does not add a newline', () => {
      expect(
        makeFormatter(ensureTopLevelBlocksAreSeparated)(
          'resource "aws_route_53_zone" "my_zone" {}'
        )
      ).toMatchInlineSnapshot(
        `"resource \\"aws_route_53_zone\\" \\"my_zone\\" {}"`
      );
    });
  });

  describe('when there are multiple blocks', () => {
    it('separates them with a blank line', () => {
      expect(
        makeFormatter(ensureTopLevelBlocksAreSeparated)(
          [
            'resource "aws_route_53_zone" "my_zone1" {}',
            'resource "aws_route_53_zone" "my_zone2" {}',
            'resource "aws_route_53_zone" "my_zone3" {}'
          ].join('')
        )
      ).toMatchInlineSnapshot(`
        "resource \\"aws_route_53_zone\\" \\"my_zone1\\" {}

        resource \\"aws_route_53_zone\\" \\"my_zone2\\" {}

        resource \\"aws_route_53_zone\\" \\"my_zone3\\" {}"
      `);
    });

    it('ensures a blank line between blocks', () => {
      expect(
        makeFormatter(ensureTopLevelBlocksAreSeparated)(`
          resource "aws_route_53_zone" "my_zone1" {}
          resource "aws_route_53_zone" "my_zone2" {}
          resource "aws_route_53_zone" "my_zone3" {}
        `)
      ).toMatchInlineSnapshot(`
        "resource \\"aws_route_53_zone\\" \\"my_zone1\\" {}

        resource \\"aws_route_53_zone\\" \\"my_zone2\\" {}

        resource \\"aws_route_53_zone\\" \\"my_zone3\\" {}"
      `);
    });

    describe('when they are already separated', () => {
      it('does not add more blank lines', () => {
        expect(
          makeFormatter(ensureTopLevelBlocksAreSeparated)(`
          resource "aws_route_53_zone" "my_zone1" {}

          resource "aws_route_53_zone" "my_zone2" {}


          resource "aws_route_53_zone" "my_zone3" {}
        `)
        ).toMatchInlineSnapshot(`
          "resource \\"aws_route_53_zone\\" \\"my_zone1\\" {}

          resource \\"aws_route_53_zone\\" \\"my_zone2\\" {}


          resource \\"aws_route_53_zone\\" \\"my_zone3\\" {}"
        `);
      });
    });

    describe('when there are comments', () => {
      it('does not consider them a block separator', () => {
        expect(
          makeFormatter(ensureTopLevelBlocksAreSeparated)(`
          resource "aws_route_53_zone" "my_zone1" {}
          # hello world
          resource "aws_route_53_zone" "my_zone2" {}

          locals { env_name = "my_env" }
        `)
        ).toMatchInlineSnapshot(`
          "resource \\"aws_route_53_zone\\" \\"my_zone1\\" {}

          # hello world
          resource \\"aws_route_53_zone\\" \\"my_zone2\\" {}

          locals { env_name = \\"my_env\\" }"
        `);
      });

      it('checks the start of the leading text for the newline', () => {
        expect(
          makeFormatter(ensureTopLevelBlocksAreSeparated)(`
          locals { env_name = "my_env" }
          ###################################################
          # My Hosted Zone                                  #
          ###################################################

          resource "aws_route_53_zone" "my_zone" {}
        `)
        ).toMatchInlineSnapshot(`
          "locals { env_name = \\"my_env\\" }

          ###################################################
          # My Hosted Zone                                  #
          ###################################################

          resource \\"aws_route_53_zone\\" \\"my_zone\\" {}"
        `);
      });
    });
  });
});

describe('ensureLabelsHaveLeadingSpace', () => {
  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(ensureLabelsHaveLeadingSpace([])).toStrictEqual([]);
    });
  });

  describe('when there are no labels', () => {
    it('does nothing', () => {
      expect(
        makeFormatter(ensureLabelsHaveLeadingSpace)(`
          locals {
            m = {
              v1 = "hello",
              v2 = "world",
              v3 = "!"
            }
          }
        `)
      ).toMatchInlineSnapshot(`
        "locals {
          m = {
            v1 = \\"hello\\",
            v2 = \\"world\\",
            v3 = \\"!\\"
          }
        }"
      `);
    });
  });

  describe('when there are labels', () => {
    it('ensures all labels have a leading space', () => {
      expect(
        makeFormatter(ensureLabelsHaveLeadingSpace)(`
          resource"aws_route_53_zone""my_zone1" {}
          resource aws_route_53_zone my_zone2 {}
          resource/**/aws_route_53_zone/**/my_zone3 {}
        `)
      ).toMatchInlineSnapshot(`
        "resource \\"aws_route_53_zone\\" \\"my_zone1\\" {}
        resource aws_route_53_zone my_zone2 {}
        resource /**/aws_route_53_zone /**/my_zone3 {}"
      `);
    });
  });
});

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

describe('ensureSpaceBeforeOpeningBrace', () => {
  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(ensureSpaceBeforeOpeningBrace([])).toStrictEqual([]);
    });
  });

  describe('when there are blocks', () => {
    it('ensures that there is a space before the opening brace', () => {
      expect(
        makeFormatter(ensureSpaceBeforeOpeningBrace)(`
          locals{
            myMap ={
              value = 1
            }
          }
          resource aws_route53_zone my_zone{}
          module my_module{}

          resource aws_security_group my_group{
            ingress{}
          }
        `)
      ).toMatchInlineSnapshot(`
        "locals {
          myMap = {
            value = 1
          }
        }
        resource aws_route53_zone my_zone {}
        module my_module {}

        resource aws_security_group my_group {
          ingress {}
        }"
      `);
    });
  });
});

describe('ensureNoSpaceAfterFunctionName', () => {
  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(ensureNoSpacesAfterFunctionName([])).toStrictEqual([]);
    });
  });

  it('ensures that there are no spaces after the function name', () => {
    expect(
      makeFormatter(ensureNoSpacesAfterFunctionName)(
        'locals { myValue = fn () }'
      )
    ).toStrictEqual('locals { myValue = fn() }');
  });

  it('ensures that there are no newlines after the function name', () => {
    expect(
      makeFormatter(ensureNoSpacesAfterFunctionName)(`
        locals {
          myValue = fn
            ()
        }
      `)
    ).toStrictEqual(dedent`
      locals {
        myValue = fn()
      }
    `);
  });

  it('does not the contents of comments', () => {
    expect(
      makeFormatter(ensureNoSpacesAfterFunctionName)(`
        locals {
          myValue = fn /*
            hello
            world
          */ ()
        }
      `)
    ).toStrictEqual(dedent`
      locals {
        myValue = fn/*
          hello
          world
        */()
      }
    `);
  });

  it('does not cause invalid single line comments', () => {
    expect(
      makeFormatter(ensureNoSpacesAfterFunctionName)(`
        locals {
          myValue = fn // hello world
            ()
        }
      `)
    ).toStrictEqual(dedent`
      locals {
        myValue = fn// hello world
      ()
      }
    `);
  });
});

describe('ensureIndentation', () => {
  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(ensureIndentation([])).toStrictEqual([]);
    });
  });

  describe('irl fixtures', () => {
    const trimStartOfLines = (str: string): string =>
      str
        .split('\n')
        .map(line => line.trimStart())
        .join('\n');

    const ensureIndentationFormatter = (str: string): string =>
      makeFormatter(ensureIndentation)(trimStartOfLines(str));

    it.each(irlFixtures)('it indents this %s as expected', (_, content) => {
      expect(ensureIndentationFormatter(content)).toStrictEqual(content);
    });
  });

  it('correctly indents list items', () => {
    expect(makeFormatter(ensureIndentation)`
      locals {
        values = []

        values = [a, b, c, d]

              values = [a,
        b,
            c,
        d,]

              values = [
        a,
        b,
        c,
        d,
        ]

        values = [
        [
        [
        a,
        b,
        c,
        ]
        ]
        ]

        values = [
      a,
        b,
          c,
        d,
        ]

        values = [
        a, b,
        c, d,
        ]

        values = [
          [
        a,
          b,
            c,
          d,
          ]
       ]
      }
    `).toMatchInlineSnapshot(`
      "locals {
        values = []

        values = [a, b, c, d]

        values = [a,
          b,
          c,
          d,]

        values = [
          a,
          b,
          c,
          d,
        ]

        values = [
          [
            [
              a,
              b,
              c,
            ]
          ]
        ]

        values = [
          a,
          b,
          c,
          d,
        ]

        values = [
          a, b,
          c, d,
        ]

        values = [
          [
            a,
            b,
            c,
            d,
          ]
        ]
      }"
    `);
  });

  it('correctly indents function items', () => {
    expect(makeFormatter(ensureIndentation)`
      locals {
        values = fn()

        values = fn(a, b, c, d)

              values = fn(a,
            b,
              c,
            d,)

              values = fn(
        a,
        b,
        c,
        d,
          )

        values = fn(
        fn(
        fn(
        a,
        b,
        c,
        )
        )
        )

        values = fn(
      a,
        b,
          c,
        d,
        )

        values = fn(
        a, b,
        c, d,
        )

        values = fn(
          fn(
        a,
          b,
            c,
          d,
          )
        )
      }
    `).toMatchInlineSnapshot(`
      "locals {
        values = fn()

        values = fn(a, b, c, d)

        values = fn(a,
          b,
          c,
          d,)

        values = fn(
          a,
          b,
          c,
          d,
        )

        values = fn(
          fn(
            fn(
              a,
              b,
              c,
            )
          )
        )

        values = fn(
          a,
          b,
          c,
          d,
        )

        values = fn(
          a, b,
          c, d,
        )

        values = fn(
          fn(
            a,
            b,
            c,
            d,
          )
        )
      }"
    `);
  });

  it('correctly indents maps', () => {
    expect(makeFormatter(ensureIndentation)`
      locals {
        map = {}

        map = { v = 1 }

        map = {
        a = 1
        b = 2
        c = 3
        }

        map = { a = 1, b = 2
          c = 3 }

          map = { a = 1, b = 2
          c = 3 }

        map = { a = 1, b = 2, c = 3 }

          map = {
    a = 1 b = 2
    c = 3
  }

  map = { a = 1, b = 2
          c = 3 }

          map = {
          a = 1, b = 2 c = 3 }

          map = {
          a = 1,
           b = 2 c = 3 }

           map = {
           map = {
           map = {
           map = {}
           }
           }
           }
      }
    `).toMatchInlineSnapshot(`
      "locals {
        map = {}

        map = { v = 1 }

        map = {
          a = 1
          b = 2
          c = 3
        }

        map = { a = 1, b = 2
          c = 3 }

        map = { a = 1, b = 2
          c = 3 }

        map = { a = 1, b = 2, c = 3 }

        map = {
          a = 1 b = 2
          c = 3
        }

        map = { a = 1, b = 2
          c = 3 }

        map = {
          a = 1, b = 2 c = 3 }

        map = {
          a = 1,
          b = 2 c = 3 }

        map = {
          map = {
            map = {
              map = {}
            }
          }
        }
      }"
    `);
  });

  it('correctly indents mixed content', () => {
    expect(makeFormatter(ensureIndentation)`
      locals {
        map = { v = fn([]) }

        map = {
        list = [
                  a,
      b,
              c,
            ]

          fn = fn(
              a,
          b,
                    c,
        )
            }

                   v = fn({
          a = 1,
              b = 2
          c = 3,
        })

       v = fn([
                a,
          b,
              c,
                        ])

      v = fn(
        a,
          [
            a,
              b,
                c,
                  ],
                    fn([
                  [
                1,
              2,
            ],
          3
        ]),
            b,
              c,
            )
      }
    `).toMatchInlineSnapshot(`
      "locals {
        map = { v = fn([]) }

        map = {
          list = [
            a,
            b,
            c,
          ]

          fn = fn(
            a,
            b,
            c,
          )
        }

        v = fn({
          a = 1,
          b = 2
          c = 3,
        })

        v = fn([
          a,
          b,
          c,
        ])

        v = fn(
          a,
          [
            a,
            b,
            c,
          ],
          fn([
            [
              1,
              2,
            ],
            3
          ]),
          b,
          c,
        )
      }"
    `);
  });

  it('correctly indents content with comments', () => {
    expect(makeFormatter(ensureIndentation)`
      locals {
        list = [/* hello */ a, /* world */ b]
        list = [
      /* hello */ a,
               /* world */ b
        ]

      v = fn(/*
            hello
            world
             */)

      v = fn(
            /*
           hello
           world
          */
            )

      map = {
              // hello
      v = [
              // world
      ]
      }

             myList = [
      # hello
        fn(
           /*
             this
         is
           my
             comment
            */
            )
            ]
      map = {}
      list = []
      list = [
      ]
      list =
      [
      ]
      list = // hello
      [
      ]
      list = /*

      */[
      ]

      //
      list = [/**/]
      list = [/*
      */]
      list = [//
      ]
      list = [
      //
      ]
      list = [
      //
      //
      ]
      list = [
      //
      a
      //
      /**/]
      list = [/**/
      //
      //
      ]
      //
      /**/}
    `).toMatchInlineSnapshot(`
      "locals {
        list = [/* hello */ a, /* world */ b]
        list = [
          /* hello */ a,
          /* world */ b
        ]

        v = fn(/*
            hello
            world
             */)

        v = fn(
          /*
           hello
           world
          */
        )

        map = {
          // hello
          v = [
            // world
          ]
        }

        myList = [
          # hello
          fn(
            /*
             this
         is
           my
             comment
            */
          )
        ]
        map = {}
        list = []
        list = [
        ]
        list =
        [
        ]
        list = // hello
        [
        ]
        list = /*

      */[
        ]

        //
        list = [/**/]
        list = [/*
      */]
        list = [//
        ]
        list = [
          //
        ]
        list = [
          //
          //
        ]
        list = [
          //
          a
          //
        /**/]
        list = [/**/
          //
          //
        ]
        //
      /**/}"
    `);
  });

  it('correctly indents comments at the end of things', () => {
    expect(makeFormatter(ensureIndentation)`
      locals {
      fn = fn(
      {
      list = [
      # END OF LIST
      ]
      # END OF MAP
      }
      # END OF FUNCTION
      )
      # END OF BLOCK
      }
    `).toMatchInlineSnapshot(`
      "locals {
        fn = fn(
          {
            list = [
              # END OF LIST
            ]
            # END OF MAP
          }
          # END OF FUNCTION
        )
        # END OF BLOCK
      }"
    `);
  });
});
