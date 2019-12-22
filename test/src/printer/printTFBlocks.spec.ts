import { makeTFArgument, makeTFBlock, makeTFLabel } from '@src/makers';
import { printTFBlocks } from '@src/printer';

describe('printTFBlocks', () => {
  it('prints as expected', () => {
    expect(
      printTFBlocks([
        makeTFBlock(
          'resource',
          [
            makeTFLabel('aws_route53_zone', { leadingOuterText: ' ' }),
            makeTFLabel('my_route', { leadingOuterText: ' ' })
          ],
          [
            makeTFArgument('name', '"myroute.com"'),
            makeTFArgument('comment', '"This is my Zone!"')
          ],
          { leadingOuterText: '\n' }
        )
      ])
    ).toMatchInlineSnapshot(`
      "
      resource aws_route53_zone my_route{name = \\"myroute.com\\"comment = \\"This is my Zone!\\"}"
    `);
  });
});
