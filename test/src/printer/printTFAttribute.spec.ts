import {
  makeTFAttribute,
  makeTFIdentifier,
  makeTFSimpleLiteral
} from '@src/makers';
import { printTFAttribute } from '@src/printer';

describe('printTFAttribute', () => {
  it('prints as expected', () => {
    expect(
      printTFAttribute(
        makeTFAttribute(makeTFIdentifier('key'), makeTFSimpleLiteral('true'), {
          trailingInnerText: '/* hello world */'
        })
      )
    ).toMatchInlineSnapshot(`"key=/* hello world */true"`);
  });
});
