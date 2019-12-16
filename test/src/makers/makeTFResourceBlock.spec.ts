import { makeTFBlockBody, makeTFResourceBlock } from '@src/makers';
import { TFNodeType, TFResourceBlock } from '@src/types';
import { AwsResourceType } from '@src/utils';

describe('makeTFResourceBlock', () => {
  it('makes a TFResourceBlock', () => {
    expect(
      makeTFResourceBlock(
        AwsResourceType.AWS_ROUTE53_ZONE,
        'my_resource',
        makeTFBlockBody([]),
        { leadingOuterText: '/* hello world */' }
      )
    ).toStrictEqual<TFResourceBlock>({
      type: TFNodeType.Resource,
      resource: AwsResourceType.AWS_ROUTE53_ZONE,
      name: 'my_resource',
      body: makeTFBlockBody([]),
      surroundingText: {
        leadingOuterText: '/* hello world */',
        trailingOuterText: ''
      }
    });
  });

  describe('when "body" is an array', () => {
    it('makes it into a TFBlockBody node', () => {
      expect(
        makeTFResourceBlock(
          AwsResourceType.AWS_ROUTE53_ZONE,
          'my_resource',
          [],
          { leadingOuterText: '/* hello sunshine */' }
        )
      ).toStrictEqual<TFResourceBlock>({
        type: TFNodeType.Resource,
        resource: AwsResourceType.AWS_ROUTE53_ZONE,
        name: 'my_resource',
        body: makeTFBlockBody([]),
        surroundingText: {
          leadingOuterText: '/* hello sunshine */',
          trailingOuterText: ''
        }
      });
    });
  });
});
