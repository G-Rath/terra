import { ensureTopLevelBlocksAreSeparated } from '@src/formatter';
import { makeFormatter } from '@test/helpers';

describe('ensureTopLevelBlocksAreSeparated', () => {
  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(ensureTopLevelBlocksAreSeparated([])).toStrictEqual([]);
    });
  });

  describe('when there is only one block', () => {
    it('does not add a newline', () => {
      expect(
        makeFormatter(ensureTopLevelBlocksAreSeparated)(
          'resource "aws_route_53_zone" "my_zone" {}'
        )
      ).toMatchInlineSnapshot(
        `"resource \\"aws_route_53_zone\\" \\"my_zone\\" {}"`
      );
    });
  });

  describe('when there are multiple blocks', () => {
    it('separates them with a blank line', () => {
      expect(
        makeFormatter(ensureTopLevelBlocksAreSeparated)(
          [
            'resource "aws_route_53_zone" "my_zone1" {}',
            'resource "aws_route_53_zone" "my_zone2" {}',
            'resource "aws_route_53_zone" "my_zone3" {}'
          ].join('')
        )
      ).toMatchInlineSnapshot(`
        "resource \\"aws_route_53_zone\\" \\"my_zone1\\" {}

        resource \\"aws_route_53_zone\\" \\"my_zone2\\" {}

        resource \\"aws_route_53_zone\\" \\"my_zone3\\" {}"
      `);
    });

    it('ensures a blank line between blocks', () => {
      expect(
        makeFormatter(ensureTopLevelBlocksAreSeparated)(`
          resource "aws_route_53_zone" "my_zone1" {}
          resource "aws_route_53_zone" "my_zone2" {}
          resource "aws_route_53_zone" "my_zone3" {}
        `)
      ).toMatchInlineSnapshot(`
        "resource \\"aws_route_53_zone\\" \\"my_zone1\\" {}

        resource \\"aws_route_53_zone\\" \\"my_zone2\\" {}

        resource \\"aws_route_53_zone\\" \\"my_zone3\\" {}"
      `);
    });

    describe('when they are already separated', () => {
      it('does not add more blank lines', () => {
        expect(
          makeFormatter(ensureTopLevelBlocksAreSeparated)(`
          resource "aws_route_53_zone" "my_zone1" {}

          resource "aws_route_53_zone" "my_zone2" {}


          resource "aws_route_53_zone" "my_zone3" {}
        `)
        ).toMatchInlineSnapshot(`
          "resource \\"aws_route_53_zone\\" \\"my_zone1\\" {}

          resource \\"aws_route_53_zone\\" \\"my_zone2\\" {}


          resource \\"aws_route_53_zone\\" \\"my_zone3\\" {}"
        `);
      });
    });

    describe('when there are comments', () => {
      it('does not consider them a block separator', () => {
        expect(
          makeFormatter(ensureTopLevelBlocksAreSeparated)(`
          resource "aws_route_53_zone" "my_zone1" {}
          # hello world
          resource "aws_route_53_zone" "my_zone2" {}

          locals { env_name = "my_env" }
        `)
        ).toMatchInlineSnapshot(`
          "resource \\"aws_route_53_zone\\" \\"my_zone1\\" {}

          # hello world
          resource \\"aws_route_53_zone\\" \\"my_zone2\\" {}

          locals { env_name = \\"my_env\\" }"
        `);
      });

      it('checks the start of the leading text for the newline', () => {
        expect(
          makeFormatter(ensureTopLevelBlocksAreSeparated)(`
          locals { env_name = "my_env" }
          ###################################################
          # My Hosted Zone                                  #
          ###################################################

          resource "aws_route_53_zone" "my_zone" {}
        `)
        ).toMatchInlineSnapshot(`
          "locals { env_name = \\"my_env\\" }

          ###################################################
          # My Hosted Zone                                  #
          ###################################################

          resource \\"aws_route_53_zone\\" \\"my_zone\\" {}"
        `);
      });
    });
  });
});
