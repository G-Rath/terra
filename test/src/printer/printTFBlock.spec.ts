import {
  makeTFArgument,
  makeTFBlock,
  makeTFBlockBody,
  makeTFIdentifier,
  makeTFLabel
} from '@src/makers';
import { printTFBlock } from '@src/printer';

describe('printTFBlock', () => {
  it('starts with the leadingOuterText', () => {
    expect(
      printTFBlock(
        makeTFBlock('resource', [], [], {
          leadingOuterText: '\n'
        })
      )
    ).toMatch(/^\n/u);
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
          )
        )
      )
    ).toMatchInlineSnapshot(`
      "resource aws_route53_zone my_route {
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
    ).toMatch(/\n$/u);
  });
});
