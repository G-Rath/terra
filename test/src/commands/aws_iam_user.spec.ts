import * as collectors from '@src/collectors';
import { AwsIamUser } from '@src/commands';

describe('aws_iam_user', () => {
  let logSpy: jest.SpiedFunction<typeof AwsIamUser.prototype.log>;
  let collectIAMUserDetailsSpy: jest.SpiedFunction<typeof collectors.collectIAMUserDetails>;

  beforeEach(() => {
    logSpy = jest.spyOn(AwsIamUser.prototype, 'log');
    collectIAMUserDetailsSpy = jest
      .spyOn(collectors, 'collectIAMUserDetails')
      .mockResolvedValue([]);
  });

  it('supports the three base flags', async () => {
    expect(await AwsIamUser.run(['-F', '-w', '-f', 'myfile'])).toBeUndefined();
  });

  describe('when called without an argument', () => {
    it('logs what is about to happen', async () => {
      await AwsIamUser.run([]);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Preparing to generate Terraform configuration for Users'
        )
      );
    });

    it('passes undefined to the collector', async () => {
      await AwsIamUser.run([]);

      expect(collectIAMUserDetailsSpy).toHaveBeenCalledWith(undefined);
    });
  });

  describe('when called with an argument', () => {
    it('logs what is about to happen', async () => {
      await AwsIamUser.run(['my-user']);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Preparing to generate Terraform configuration for User my-user'
        )
      );
    });

    it('passes the argument to the collector', async () => {
      await AwsIamUser.run(['my-user']);

      expect(collectIAMUserDetailsSpy).toHaveBeenCalledWith('my-user');
    });
  });
});
