import { normaliseRoute53Name } from '@src/utils';

describe('normaliseRoute53Name', () => {
  describe('when the name is already normalised', () => {
    it('does nothing', () => {
      const name = 'imnotcrazy.info';

      expect(normaliseRoute53Name(name)).toBe(name);
    });

    it('is only transformed once', () => {
      const name = 'imnotcrazy.info.';

      expect(normaliseRoute53Name(normaliseRoute53Name(name))).toBe(
        normaliseRoute53Name(name)
      );
    });
  });

  describe('when the name ends with a dot', () => {
    it('removes it', () => {
      expect(normaliseRoute53Name('imnotcrazy.info.')).toBe('imnotcrazy.info');
    });
  });

  describe('when the zone is provided', () => {
    describe('when the name ends with the zone', () => {
      it('removes the zone', () => {
        const name = 'wow';
        const zone = 'imnotcrazy.info';

        expect(normaliseRoute53Name(`${name}.${zone}`, zone)).toBe(name);
      });
    });

    describe('when the name does not end with the zone', () => {
      it('normalises without removing the zone', () => {
        const name = 'wow';
        const zone = 'imnotcrazy.info';

        expect(normaliseRoute53Name(`${zone}.${name}`, zone)).toBe(
          `${zone}.${name}`
        );
      });
    });

    describe('when checking to remove the zone', () => {
      it('normalises it first', () => {
        const name = 'wow';
        const zone = 'imnotcrazy.info.';

        expect(normaliseRoute53Name(`${name}.${zone}`, zone)).toBe(name);
      });
    });

    describe('when is name is the same as the zone', () => {
      it('returns an empty string', () => {
        const name = 'imnotcrazy.info.';

        expect(normaliseRoute53Name(name, name)).toBe('');
      });
    });
  });
});
