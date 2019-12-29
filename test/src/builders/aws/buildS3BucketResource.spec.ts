import { buildS3BucketResource } from '@src/builders';
import { AwsResourceType } from '@src/utils';

describe('buildS3BucketResource', () => {
  it('builds an aws_s3_bucket resource', () => {
    const resource = buildS3BucketResource({
      BucketName: 'mybucket'
    });

    expect(resource).toBeTFBlockWithLabel(AwsResourceType.AWS_S3_BUCKET, 0);
  });

  it('uses "BucketName" to build the resource name', () => {
    const resource = buildS3BucketResource({
      BucketName: 'mybucket'
    });

    expect(resource).toBeTFBlockWithLabel('mybucket', 1);
  });

  describe('the required arguments', () => {
    it('includes the "bucket" argument', () => {
      const { body } = buildS3BucketResource({
        BucketName: 'mybucket'
      });

      expect(body).toContainTFArgumentWithExpression('bucket', '"mybucket"');
    });
  });
});
