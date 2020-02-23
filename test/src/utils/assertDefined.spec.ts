import { assertDefined } from '@src/utils';

describe('assertIsDefinedAndNotNull', () => {
  it('throws on undefined', () => {
    expect(() => assertDefined(undefined)).toThrow(
      'Unexpected undefined value'
    );
  });

  describe('when the value is not undefined', () => {
    it.each([
      null,
      0,
      '',
      false,
      true,
      1024,
      'hello world',
      {},
      [],
      [undefined],
      { prop: undefined }
    ])('does not throw', value => {
      expect(() => assertDefined(value)).not.toThrow();
    });
  });

  describe('when a message is provided', () => {
    it('uses it for the error message', () => {
      const message = 'This value should not be undefined!';

      expect(() => assertDefined(undefined, message)).toThrow(message);
    });
  });
});
