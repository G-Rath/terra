import * as collectors from '@src/collectors';
import { AwsIamGroup } from '@src/commands';

describe('aws_iam_group', () => {
  let logSpy: jest.SpiedFunction<typeof AwsIamGroup.prototype.log>;
  let collectIAMGroupDetailsSpy: jest.SpiedFunction<typeof collectors.collectIAMGroupDetails>;

  beforeEach(() => {
    logSpy = jest.spyOn(AwsIamGroup.prototype, 'log');
    collectIAMGroupDetailsSpy = jest
      .spyOn(collectors, 'collectIAMGroupDetails')
      .mockResolvedValue([]);
  });

  it('supports the three base flags', async () => {
    expect(await AwsIamGroup.run(['-F', '-w', '-f', 'myfile'])).toBeUndefined();
  });

  describe('when called without an argument', () => {
    it('logs what is about to happen', async () => {
      await AwsIamGroup.run([]);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Preparing to generate Terraform configuration for Groups'
        )
      );
    });

    it('passes undefined to the collector', async () => {
      await AwsIamGroup.run([]);

      expect(collectIAMGroupDetailsSpy).toHaveBeenCalledWith(undefined);
    });
  });

  describe('when called with an argument', () => {
    it('logs what is about to happen', async () => {
      await AwsIamGroup.run(['my-group']);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Preparing to generate Terraform configuration for Group my-group'
        )
      );
    });

    it('passes the argument to the collector', async () => {
      await AwsIamGroup.run(['my-group']);

      expect(collectIAMGroupDetailsSpy).toHaveBeenCalledWith('my-group');
    });
  });
});
