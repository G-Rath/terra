import { makeTFLabel } from '@src/makers';
import { TFLabel, TFNodeType } from '@src/types';

describe('makeTFLabel', () => {
  it('makes a TFLabel', () => {
    expect(
      makeTFLabel('aws_route53_zone', {
        leadingOuterText: 'hello world'
      })
    ).toStrictEqual<TFLabel>({
      type: TFNodeType.Label,
      value: 'aws_route53_zone',
      surroundingText: {
        leadingOuterText: 'hello world',
        trailingOuterText: ''
      }
    });
  });
});
