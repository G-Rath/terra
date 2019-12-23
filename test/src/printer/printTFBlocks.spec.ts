import {
  makeTFArgument,
  makeTFBlock,
  makeTFBlockBody,
  makeTFIdentifier,
  makeTFLabel
} from '@src/makers';
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
          makeTFBlockBody(
            [
              makeTFArgument(
                makeTFIdentifier('name', { leadingOuterText: '\n  ' }),
                '"example.com"',
                { leadingInnerText: ' ', trailingInnerText: ' ' }
              ),
              makeTFArgument(
                makeTFIdentifier('comment', { leadingOuterText: '\n  ' }),
                '"This is my Zone!"',
                { leadingInnerText: ' ', trailingInnerText: ' ' }
              )
            ],
            { leadingOuterText: ' ', trailingInnerText: '\n' }
          ),
          { leadingOuterText: '\n' }
        )
      ])
    ).toMatchInlineSnapshot(`
      "
      resource aws_route53_zone my_route {
        name = \\"example.com\\"
        comment = \\"This is my Zone!\\"
      }"
    `);
  });
});
