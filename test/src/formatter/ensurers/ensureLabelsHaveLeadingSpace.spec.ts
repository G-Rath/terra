import { ensureLabelsHaveLeadingSpace } from '@src/formatter';
import { makeFormatter } from '@test/helpers';

describe('ensureLabelsHaveLeadingSpace', () => {
  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(ensureLabelsHaveLeadingSpace([])).toStrictEqual([]);
    });
  });

  describe('when there are no labels', () => {
    it('does nothing', () => {
      expect(
        makeFormatter(ensureLabelsHaveLeadingSpace)(`
          locals {
            m = {
              v1 = "hello",
              v2 = "world",
              v3 = "!"
            }
          }
        `)
      ).toMatchInlineSnapshot(`
        "locals {
          m = {
            v1 = \\"hello\\",
            v2 = \\"world\\",
            v3 = \\"!\\"
          }
        }"
      `);
    });
  });

  describe('when there are labels', () => {
    it('ensures all labels have a leading space', () => {
      expect(
        makeFormatter(ensureLabelsHaveLeadingSpace)(`
          resource"aws_route_53_zone""my_zone1" {}
          resource aws_route_53_zone my_zone2 {}
          resource/**/aws_route_53_zone/**/my_zone3 {}
        `)
      ).toMatchInlineSnapshot(`
        "resource \\"aws_route_53_zone\\" \\"my_zone1\\" {}
        resource aws_route_53_zone my_zone2 {}
        resource /**/aws_route_53_zone /**/my_zone3 {}"
      `);
    });
  });
});
