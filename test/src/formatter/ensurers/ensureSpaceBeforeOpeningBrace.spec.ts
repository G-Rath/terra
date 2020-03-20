import { ensureSpaceBeforeOpeningBrace } from '@src/formatter';
import { makeFormatter } from '@test/helpers';

describe('ensureSpaceBeforeOpeningBrace', () => {
  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(ensureSpaceBeforeOpeningBrace([])).toStrictEqual([]);
    });
  });

  describe('when there are blocks', () => {
    it('ensures that there is a space before the opening brace', () => {
      expect(
        makeFormatter(ensureSpaceBeforeOpeningBrace)(`
          locals{
            myMap ={
              value = 1
            }
          }
          resource aws_route53_zone my_zone{}
          module my_module{}

          resource aws_security_group my_group{
            ingress{}
          }
        `)
      ).toMatchInlineSnapshot(`
        "locals {
          myMap = {
            value = 1
          }
        }
        resource aws_route53_zone my_zone {}
        module my_module {}

        resource aws_security_group my_group {
          ingress {}
        }"
      `);
    });
  });
});
