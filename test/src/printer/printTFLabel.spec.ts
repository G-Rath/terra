import { makeTFLabel } from '@src/makers';
import { printTFLabel } from '@src/printer';

describe('printTFLabel', () => {
  it('prints as expected', () => {
    expect(
      printTFLabel(
        makeTFLabel('"aws_route53_resource"', {
          leadingOuterText: '/* hello */',
          trailingOuterText: '/* world */'
        })
      )
    ).toMatchInlineSnapshot(
      `"/* hello */\\"aws_route53_resource\\"/* world */"`
    );
  });
});
