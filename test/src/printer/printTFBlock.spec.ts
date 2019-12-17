import { makeTFArgument, makeTFBlock, makeTFLabel } from '@src/makers';
import { printTFBlock } from '@src/printer';

describe('printTFBlock', () => {
  it('starts with the leadingOuterText', () => {
    expect(
      printTFBlock(
        makeTFBlock('resource', [], [], {
          leadingOuterText: '\n'
        })
      )
    ).toMatch(/^\n/);
  });

  it('prints the body using printBlockBody', () => {
    expect(
      printTFBlock(
        makeTFBlock(
          'resource',
          [
            makeTFLabel('aws_route53_zone', { leadingOuterText: ' ' }),
            makeTFLabel('my_route', { leadingOuterText: ' ' })
          ],
          [
            makeTFArgument('name', '"example.com"'),
            makeTFArgument('comment', '"This is my Zone!"')
          ],
          { leadingOuterText: '\n' }
        )
      )
    ).toMatchInlineSnapshot(`
      "
      resource aws_route53_zone my_route{
        name = \\"example.com\\"
        comment = \\"This is my Zone!\\"
      }"
    `);
  });

  it('ends with the trailingOuterText', () => {
    expect(
      printTFBlock(
        makeTFBlock('resource', [], [], {
          trailingOuterText: '\n'
        })
      )
    ).toMatch(/\n$/);
  });
});
