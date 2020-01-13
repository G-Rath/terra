import { makeTFBlockBody, makeTFDataBlock, makeTFLabel } from '@src/makers';
import { TFDataBlock, TFNodeType } from '@src/types';
import { AwsDataType } from '@src/utils';

describe('makeTFDataBlock', () => {
  it('makes a TFDataBlock', () => {
    expect(
      makeTFDataBlock(
        AwsDataType.AWS_IAM_ROLE_POLICY_DOCUMENT,
        'my_resource',
        makeTFBlockBody([]),
        { leadingOuterText: '/* hello world */' }
      )
    ).toStrictEqual<TFDataBlock>({
      type: TFNodeType.Block,
      blockType: 'data',
      labels: [
        makeTFLabel(AwsDataType.AWS_IAM_ROLE_POLICY_DOCUMENT),
        makeTFLabel('my_resource')
      ],
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
        makeTFDataBlock(
          AwsDataType.AWS_IAM_ROLE_POLICY_DOCUMENT,
          'my_resource',
          [],
          {
            leadingOuterText: '/* hello sunshine */'
          }
        )
      ).toStrictEqual<TFDataBlock>({
        type: TFNodeType.Block,
        blockType: 'data',
        labels: [
          makeTFLabel(AwsDataType.AWS_IAM_ROLE_POLICY_DOCUMENT),
          makeTFLabel('my_resource')
        ],
        body: makeTFBlockBody([]),
        surroundingText: {
          leadingOuterText: '/* hello sunshine */',
          trailingOuterText: ''
        }
      });
    });
  });
});
