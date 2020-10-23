import { ensureOneArgumentPerLine } from '@src/formatter';
import { makeFormatter } from '@test/helpers';
import { irlFixtures } from '@test/irlFixtures';

describe('ensureOneArgumentPerLine', () => {
  describe('irl fixtures', () => {
    const removeNewlines = (str: string): string =>
      str
        .split('\n')
        .map(line => line.trim())
        .join(' ');

    const ensureOneArgumentPerLineFormatter = (str: string): string =>
      makeFormatter(ensureOneArgumentPerLine)(removeNewlines(str));

    it.each(irlFixtures)('it formats this %s as expected', (_, content) => {
      try {
        // eslint-disable-next-line jest/no-restricted-matchers
        expect(ensureOneArgumentPerLineFormatter(content)).toMatchSnapshot();
      } catch (error) {
        console.log(content);

        throw error;
      }
    });
  });
});
