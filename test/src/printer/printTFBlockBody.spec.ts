import { makeTFArgument, makeTFBlockBody } from '@src/makers';
import { printTFBlockBody } from '@src/printer';

describe('printTFBlockBody', () => {
  it('prints the leadingOuterText before the opening brace', () => {
    expect(
      printTFBlockBody(makeTFBlockBody([], { leadingOuterText: '\n' }))
    ).toMatch(/^\n/);
  });

  it('prints leadingInnerText after the opening brace', () => {
    expect(
      printTFBlockBody(makeTFBlockBody([], { leadingInnerText: '\n' }))
    ).toMatch(/^{\n/);
  });

  it('prints the body in-between the braces', () => {
    expect(
      printTFBlockBody(
        makeTFBlockBody([
          makeTFArgument('name', '"example.com"'),
          makeTFArgument('comment', '"This is my Zone!"')
        ])
      )
    ).toMatchInlineSnapshot(
      `"{name = \\"example.com\\"comment = \\"This is my Zone!\\"}"`
    );
  });

  it('prints the trailingInnerText before the closing brace', () => {
    expect(
      printTFBlockBody(makeTFBlockBody([], { trailingInnerText: '\n' }))
    ).toMatch(/\n}$/);
  });

  it('prints the trailingOuterText after the closing brace', () => {
    expect(
      printTFBlockBody(makeTFBlockBody([], { trailingOuterText: '\n' }))
    ).toMatch(/}\n$/);
  });
});