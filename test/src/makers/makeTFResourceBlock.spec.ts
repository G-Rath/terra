import { makeTFResourceBlock } from '@src/makers';
import { TFNodeType, TFResourceBlock } from '@src/types';
import { AwsResourceType } from '@src/utils';

describe('makeTFResourceBlock', () => {
  it('makes a TFResourceBlock', () => {
    expect(
      makeTFResourceBlock('my_resource', AwsResourceType.AWS_ROUTE53_ZONE, [])
    ).toStrictEqual<TFResourceBlock>({
      type: TFNodeType.Resource,
      resource: AwsResourceType.AWS_ROUTE53_ZONE,
      name: 'my_resource',
      body: []
    });
  });
});
