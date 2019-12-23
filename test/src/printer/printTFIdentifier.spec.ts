import { makeTFIdentifier } from '@src/makers';
import { printTFIdentifier } from '@src/printer';

describe('printTFIdentifier', () => {
  it('prints as expected', () => {
    expect(
      printTFIdentifier(
        makeTFIdentifier('name', {
          leadingOuterText: '/* hello */',
          trailingOuterText: '/* world */'
        })
      )
    ).toMatchInlineSnapshot(`"/* hello */name/* world */"`);
  });
});
