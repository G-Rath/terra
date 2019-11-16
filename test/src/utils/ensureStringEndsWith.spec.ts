import { ensureStringEndsWith } from '@src/utils';

describe('ensureStringEndsWith', () => {
  describe('when the ending is not present', () => {
    it('appends it', () => {
      expect(ensureStringEndsWith('main.tf', '.tf')).toBe('main.tf');
    });
  });

  describe('when the ending is already present', () => {
    it('does nothing', () => {
      expect(ensureStringEndsWith('main', '.tf')).toBe('main.tf');
    });
  });
});
