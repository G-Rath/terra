import { buildEC2ElasticIPResource } from '@src/builders';
import { AwsResourceType } from '@src/utils';

describe('buildEC2ElasticIPResource', () => {
  it('builds an aws_eip resource', () => {
    const block = buildEC2ElasticIPResource({
      allocationId: 'alloc-123456789',
      isInVPC: true,
      publicIPv4Pool: 'amazon',
      tags: []
    });

    expect(block).toBeTFBlockWithLabel(AwsResourceType.AWS_EIP, 0);
  });

  it('uses the allocation id for the name', () => {
    const block = buildEC2ElasticIPResource({
      allocationId: 'alloc-123456789',
      isInVPC: true,
      publicIPv4Pool: 'amazon',
      tags: []
    });

    expect(block).toBeTFBlockWithLabel('alloc-123456789', 1);
  });

  describe('when isInVPC is true', () => {
    it('includes it as an argument', () => {
      const { body } = buildEC2ElasticIPResource({
        allocationId: 'alloc-123456789',
        isInVPC: true,
        publicIPv4Pool: 'amazon',
        tags: []
      });

      expect(body).toContainTFArgumentWithExpression('vpc', 'true');
    });
  });

  describe('when isInVPC is false', () => {
    it('omits it asn an argument', () => {
      const { body } = buildEC2ElasticIPResource({
        allocationId: 'alloc-123456789',
        isInVPC: false,
        publicIPv4Pool: 'amazon',
        tags: []
      });

      expect(body).not.toContainTFArgument('vpc');
    });
  });

  describe('when the details include an association', () => {
    it('includes the association as an argument', () => {
      const { body } = buildEC2ElasticIPResource({
        allocationId: 'alloc-123456789',
        isInVPC: true,
        association: {
          method: 'instance',
          id: 'i-da176875'
        },
        publicIPv4Pool: 'amazon',
        tags: []
      });

      expect(body).toContainTFArgumentWithExpression(
        'instance',
        '"i-da176875"'
      );
    });
  });

  describe('when the public pool is not amazon', () => {
    it('includes it as an argument', () => {
      const { body } = buildEC2ElasticIPResource({
        allocationId: 'alloc-123456789',
        publicIPv4Pool: '10.0.0.1',
        isInVPC: true,
        tags: []
      });

      expect(body).toContainTFArgumentWithExpression(
        'public_ipv4_pool',
        '"10.0.0.1"'
      );
    });
  });

  describe('when the public pool is amazon', () => {
    it('omits it as an argument', () => {
      const { body } = buildEC2ElasticIPResource({
        allocationId: 'alloc-123456789',
        publicIPv4Pool: 'amazon',
        isInVPC: true,
        tags: []
      });

      expect(body).not.toContainTFArgument('public_ipv4_pool');
    });
  });
});
