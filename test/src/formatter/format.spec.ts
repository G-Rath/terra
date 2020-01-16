import { format } from '@src/formatter';
import { makeTFResourceBlock } from '@src/makers';
import { TFFileContents } from '@src/types';
import { AwsResourceType } from '@src/utils';

describe('format', () => {
  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(
        format({
          blocks: [],
          surroundingText: {
            leadingOuterText: '',
            trailingOuterText: ''
          }
        })
      ).toStrictEqual<TFFileContents>({
        blocks: [],
        surroundingText: {
          leadingOuterText: '',
          trailingOuterText: ''
        }
      });
    });
  });

  describe('when there is at least one block', () => {
    it('does nothing', () => {
      expect(
        format({
          blocks: [
            makeTFResourceBlock(
              AwsResourceType.AWS_ROUTE53_ZONE, //
              'my_zone',
              []
            )
          ],
          surroundingText: {
            leadingOuterText: '',
            trailingOuterText: ''
          }
        })
      ).toStrictEqual<TFFileContents>({
        blocks: [
          makeTFResourceBlock(
            AwsResourceType.AWS_ROUTE53_ZONE, //
            'my_zone',
            []
          )
        ],
        surroundingText: {
          leadingOuterText: '',
          trailingOuterText: ''
        }
      });
    });
  });
});
