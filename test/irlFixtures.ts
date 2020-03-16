import dedent from 'dedent';

export const irlFixtures: ReadonlyArray<readonly [string, string]> = [
  ['single line data block', 'data "aws_caller_identity" "current" {}'],
  [
    'simple provider block',
    dedent`
      provider "aws" {
        version    = "~> 2.30"
        access_key = var.AWS_ACCESS_KEY_ID
        secret_key = var.AWS_SECRET_ACCESS_KEY
        region     = "ap-southeast-2"
      }
    `
  ],
  [
    'cool aws_dlm_lifecycle_policy resource',
    dedent`
      resource "aws_dlm_lifecycle_policy" "server-data" {
        description        = "Server Data Volume lifecycle policy"
        execution_role_arn = aws_iam_role.dlm.arn
        state              = "ENABLED"

        policy_details {
          resource_types = ["VOLUME"]

          schedule {
            name = "\${var.days_to_keep_snapshots} days of server snapshots"

            create_rule {
              interval      = 24
              interval_unit = "HOURS"

              times = ["14:00"]
            }

            retain_rule {
              count = var.days_to_keep_snapshots
            }

            tags_to_add = {
              SnapshotCreator = "DLM"
            }

            copy_tags = true
          }

          target_tags = {
            "DLM-SnapshotGroup" = "server-data"
          }
        }
      }
    `
  ],
  [
    'jaw dropping aws_db_subnet_group resource',
    dedent`
      resource "aws_db_subnet_group" "my_db" {
        name        = "\${local.env_prefix}-db-subnets"
        subnet_ids  = module.production_network.public_subnet_ids
        description = "Subnets which may contain DB instances within \${local.env_prefix} VPC"

        tags = merge(
          local.common_tags,
          {
            "Name" = "\${local.env_prefix}-db-subnets"
          },
        )
      }
    `
  ],
  [
    'radical aws_iam_policy_document resource',
    dedent`
      data "aws_iam_policy_document" "dlm" {
        statement {
          effect  = "Allow"
          actions = [
            "ec2:CreateSnapshot",
            "ec2:DeleteSnapshot",
            "ec2:DescribeVolumes",
            "ec2:DescribeSnapshots"
          ]

          resources = ["*"]
        }

        statement {
          effect  = "Allow"
          actions = [
            "ec2:CreateTags"
          ]

          resources = ["arn:aws:ec2:*::snapshot/*"]
        }
      }
    `
  ],
  [
    'awesome locals block',
    dedent`
      locals {
        admin_locations = [
          {
            cidr_range  = "xx.xxx.xxx.xxx/xx",
            description = "My Office In A City"
          }
        ]
      }
    `
  ]
];
