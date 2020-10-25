import { ensureClosingBraceOnNewline } from '@src/formatter';
import { makeFormatter } from '@test/helpers';

describe('ensureClosingBraceOnNewline', () => {
  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(ensureClosingBraceOnNewline([])).toStrictEqual([]);
    });
  });

  it('formats Map and Body nodes', () => {
    expect(
      makeFormatter(ensureClosingBraceOnNewline)(
        'locals { map = { key = value } }'
      )
    ).toMatchInlineSnapshot(`
      "locals { map = { key = value
       }
       }"
    `);
  });

  it('handles trailing commas', () => {
    expect(
      makeFormatter(ensureClosingBraceOnNewline)(
        'locals { map = { key = value, } }'
      )
    ).toMatchInlineSnapshot(`
      "locals { map = { key = value,
       }
       }"
    `);
  });

  describe('when closing braces are already on a newline', () => {
    it('leaves them be', () => {
      expect(
        makeFormatter(ensureClosingBraceOnNewline)(`
          locals {
            map = {
              key = value
            }
          }
        `)
      ).toMatchInlineSnapshot(`
        "locals {
          map = {
            key = value
          }
        }"
      `);
    });

    it('leaves them be (really)', () => {
      expect(
        makeFormatter(ensureClosingBraceOnNewline)(`
          resource "aws_iam_policy" "client_account_assume_role" {
            policy = <<EOF
          {
            "Version": "2012-10-17",
            "Statement": [
              {
                "Effect": "Allow",
                "Action": "sts:AssumeRole",
                "Resource": ""
              }
            ]
          }
          EOF
          }
        `)
      ).toMatchInlineSnapshot(`
        "resource \\"aws_iam_policy\\" \\"client_account_assume_role\\" {
          policy = <<EOF
        {
          \\"Version\\": \\"2012-10-17\\",
          \\"Statement\\": [
            {
              \\"Effect\\": \\"Allow\\",
              \\"Action\\": \\"sts:AssumeRole\\",
              \\"Resource\\": \\"\\"
            }
          ]
        }
        EOF
        }"
      `);
    });
  });
});
