import { parseTFFileContents } from '@src/parser';
import { printTFFileContents } from '@src/printer';

const warnAboutDuplicates = (name: string, fixtures: string[]): void => {
  const duplicates = fixtures.length - new Set(fixtures).size;

  if (duplicates) {
    console.warn(
      `"${name}" has ${duplicates} duplicated fixture${
        duplicates === 1 ? '' : 's'
      }`
    );
  }
};

const parsePrintAndExpectNoChange = (
  name: string,
  fixtures: string[]
): void => {
  warnAboutDuplicates(name, fixtures);

  describe(`${name}`, () => {
    fixtures.forEach(fixture =>
      it('parses losslessly', () => {
        try {
          const output = printTFFileContents(parseTFFileContents(fixture));

          // console.log(fixture, output);

          expect(output).toBe(fixture);
        } catch (error) {
          console.log(fixture);

          throw error;
        }
      })
    );
  });
};

const wrapInLocalBlockAsValue = (valueText: string): string => `
local {
  v = ${valueText}
}
`;

// parseCommaSeparatedItemsWithinBrackets
// const generateCommaSeparatedItemsWithinBrackets

const mapAttributes = [
  '',
  'v = 1,/*hello*/',
  'v = 1, /*hello*/',
  'v = 1, /*hello*/ ',
  'v = 1 /*hello*/ ',
  'v = 1/*hello*/ ',
  'v = /*hello*/1, /*world*/',
  'v = 1 /*hello*/, /*world*/',
  'v = 1 /*hello*/ , /*world*/ ',
  'v = 1 /*hello*/ ,  /*world*/ ',
  'v = 1/*hello*/ , /*world*/ ',
  'v = 1/*hello*/, /*world*/',
  `
  a=1,b=2,c=3,
  d=4,e=5,f=6,
  `,
  `
  a = 1
  b = 2
  c = 3
  `,
  `
  a = 1,
  b = 2,
  c = 3,
  d = 4,
  e = 5,
  f = 6,
  `,
  `
  a = 1 # hello
  b = 2 // world
  `,
  `
  a = 1,// hello
  b = 2, # world
  `,
  `
  a = 1,
  b = 2,/*hello*/
  `,
  `
  a = 1,
  b = 2
  c = 3/*hello*/, // world
  `,
  `
  a = 1,
  b = 2/*hello*/,/*world*/
  `,
  `
  a = 1,
  b = 2/*hello*/ , /*world*/
  `,
  `
  a = 1,
  b = 2/*hello*/, /*world*/
  `
];

const commaSeparatedItems = [
  '',
  '/* hello world */',
  ' /* hello world */ ',
  '1,2,3',
  '1,2,3,',
  '1, 2, 3',
  '1, 2, 3,',
  '1, 2, 3,/*hello*/',
  '1, 2, 3, /*hello*/',
  '1, 2, 3, /*hello*/ ',
  '1, 2, 3 /*hello*/ ',
  '1, 2, 3/*hello*/ ',
  '1, 2, 3/*hello*/, /*world*/',
  '1, 2, 3/*hello*/ , /*world*/',
  '1, 2, 3 /*hello*/ ,  /*world*/ ',
  '1, 2, 3/*hello*/ , /*world*/ ',
  '1, 2,/*hello*/3,',
  '1, 2, /*hello*/3,',
  '1, 2, /*hello*/ 3,',
  '1, 2, /*hello*/ 3',
  '1, 2,/*hello*/ 3',
  '1, 2/*hello*/, /*world*/3,',
  '1, /*hello*/ 2, /*world*/, 3',
  '1,  /*hello*/ 2,  /*world*/ , 3',
  '1, /*hello*/ 2, /*world*/ , 3',
  '1, /*hello*/2, /*world*/, 3',
  `
  1,2,3,
  4,5,6,
  `,
  `
  1,
  2,
  3
  `,
  `
  1,
  2,
  3,
  4,
  5,
  6,
  `,
  `
  1, # hello
  2 // world
  `,
  `
  1,// hello
  2, # world
  `,
  `
  1,
  2,/*hello*/
  `,
  `
  1,
  2,
  3/*hello*/, // world
  `,
  `
  1,
  2/*hello*/,/*world*/
  `,
  `
  1,
  2/*hello*/ , /*world*/
  `,
  `
  1,
  2/*hello*/, /*world*/
  `,
  `
  1,
  // hello
  2,
  // world
  3,
  `
];

// disabled for coverage & such - this is a catch grab for shotgun testing
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('what goes in matches what comes out', () => {
  describe('lists', () => {
    parsePrintAndExpectNoChange(
      'lists: trailing comma handling',
      commaSeparatedItems.map(item => `[${item}]`).map(wrapInLocalBlockAsValue)
    );
  });

  describe('calls', () => {
    parsePrintAndExpectNoChange(
      'calls: trailing comma handling',
      commaSeparatedItems
        .map(item => `fn(${item})`)
        .map(wrapInLocalBlockAsValue)
    );

    parsePrintAndExpectNoChange(
      'inner text handling',
      [
        '',
        ' ',
        '/* hello world */',
        ' /* hello world */ ',
        `
        /*
          hello
          world
        */
         `
      ]
        .map(inner => `fn${inner}()`)
        .map(wrapInLocalBlockAsValue)
    );

    parsePrintAndExpectNoChange(
      'argument parsing',
      [
        '',
        '[]',
        ' [] ',
        ' [1, 2, 3] ',
        '[ 1, 2, 3 ]',
        '/*hello*/[ 1, 2, 3 ]/*world*/',
        '1',
        '1, 2, 3',
        '"hello world"',
        ' "hello world" ',
        '"hello", "world"',
        '"hello",/*"world"*/',
        '"hello",/**/"world"',
        '/* hello world */',
        ' /* hello world */ ',
        `
        /*
          hello
          world
        */
        `,
        `
        1,
        2,
        3,
        `,
        `
        1,
        // hello
        2,
        # world
        `
      ]
        .map(args => `fn(${args})`)
        .map(wrapInLocalBlockAsValue)
    );
  });

  describe('maps', () => {
    parsePrintAndExpectNoChange(
      'maps: trailing comma handling',
      mapAttributes
        .map(attributes => `{${attributes}}`)
        .map(wrapInLocalBlockAsValue)
    );
  });
});
