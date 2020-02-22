import { asResourceName } from '@src/utils';

describe('asResourceName', () => {
  describe('when str is already a valid Terraform name', () => {
    it('leaves the str as is', () => {
      expect(asResourceName('my_resource')).toBe('my_resource');
    });
  });

  describe('when str is already as a resource name', () => {
    it('is only transformed once', () => {
      const name = '10*.site';

      expect(asResourceName(asResourceName(name))).toBe(asResourceName(name));
    });
  });

  describe('when str contains dots', () => {
    it('replaces them with underscores', () => {
      expect(asResourceName('wow.imnotcrazy.info')).toBe('wow_imnotcrazy_info');
    });
  });

  describe('when str contains @s', () => {
    it('replaces them with _at_', () => {
      expect(asResourceName('person@company')).toBe('person_at_company');
    });
  });

  describe('when str contains =s', () => {
    it('replaces them with _eq_', () => {
      expect(asResourceName('a=b')).toBe('a_eq_b');
    });
  });

  describe('when str contains +s', () => {
    it('replaces them with _plus_', () => {
      expect(asResourceName('a+b')).toBe('a_plus_b');
    });
  });

  describe('when str contains /s', () => {
    it('replaces them with _slash_', () => {
      expect(asResourceName('a/b')).toBe('a_slash_b');
    });
  });

  describe('when str contains "*"', () => {
    it('replaces them with "_wild_"', () => {
      expect(asResourceName('*_imnotcrazy_info')).toBe(
        '_wild__imnotcrazy_info'
      );
    });
  });

  describe('when str contains \\052', () => {
    it('replaces them with "_wild_"', () => {
      expect(asResourceName('\\052_imnotcrazy_info')).toBe(
        '_wild__imnotcrazy_info'
      );
    });
  });

  describe('when str contains numbers', () => {
    describe('if they are leading', () => {
      it('prefixes with "_n_"', () => {
        expect(asResourceName('10us_nl')).toBe('_n_10us_nl');
      });
    });

    describe('if they are trailing', () => {
      it('leaves the str as is', () => {
        expect(asResourceName('us10')).toBe('us10');
      });
    });
  });
});
