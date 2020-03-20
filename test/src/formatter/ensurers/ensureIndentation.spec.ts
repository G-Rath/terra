import { ensureIndentation } from '@src/formatter';
import { makeFormatter } from '@test/helpers';
import { irlFixtures } from '@test/irlFixtures';

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
