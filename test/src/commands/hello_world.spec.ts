import { HelloWorld } from '@src/commands';

describe('hello_world', () => {
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;

  beforeEach(() => (stdoutSpy = jest.spyOn(process.stdout, 'write')));

  it('should say hello', async () => {
    await HelloWorld.run([]);

    expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('hello'));
  });

  describe('the --name flag', () => {
    it('should use the name when provided', async () => {
      await HelloWorld.run(['--name', 'person']);

      expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining('hello person')
      );
    });

    it('should map -n to --name', async () => {
      await HelloWorld.run(['-n', 'sunshine']);

      expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining('hello sunshine')
      );
    });

    describe('when the name flag is omitted', () => {
      it('should default to "world"', async () => {
        await HelloWorld.run([]);

        expect(stdoutSpy).toHaveBeenCalledWith(
          expect.stringContaining('hello world')
        );
      });
    });
  });
});
