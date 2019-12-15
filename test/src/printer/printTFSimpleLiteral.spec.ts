import { makeTFSimpleLiteral } from '@src/makers';
import { printTFSimpleLiteral } from '@src/printer';

describe('printTFSimpleLiteral', () => {
  it('prints as expected', () => {
    expect(
      printTFSimpleLiteral(
        makeTFSimpleLiteral('1', {
          leadingOuterText: '/* hello */',
          trailingOuterText: '/* world */'
        })
      )
    ).toMatchInlineSnapshot(`"/* hello */1/* world */"`);
  });
});
