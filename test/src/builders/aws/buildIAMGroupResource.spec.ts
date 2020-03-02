import { buildIAMGroupResource } from '@src/builders';
import { AwsResourceType } from '@src/utils';

describe('buildIAMGroupResource', () => {
  it('builds an aws_iam_group resource', () => {
    const resource = buildIAMGroupResource({ name: 'my-group' });

    expect(resource).toBeTFBlockWithLabel(AwsResourceType.AWS_IAM_GROUP, 0);
  });

  it('uses the group name to build the resource name', () => {
    const resource = buildIAMGroupResource({ name: 'my-group' });

    expect(resource).toBeTFBlockWithLabel('my-group', 1);
  });

  it('sanitizes the resource name', () => {
    const resource = buildIAMGroupResource({ name: '/iam+group=fun@times/' });

    expect(resource.labels[1]).toMatchInlineSnapshot(`
      Object {
        "surroundingText": Object {
          "leadingOuterText": "",
          "trailingOuterText": "",
        },
        "type": "Label",
        "value": "_slash_iam_plus_group_eq_fun_at_times_slash_",
      }
    `);
  });

  describe('when "path" is present', () => {
    it('is included as an argument', () => {
      const resource = buildIAMGroupResource({
        name: 'my-group',
        path: '/clients'
      });

      expect(resource.body).toContainTFArgumentWithExpression(
        'path',
        '"/clients"'
      );
    });
  });
});
