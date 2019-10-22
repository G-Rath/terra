import { PropertyOrNull, stringifyProperty } from '@src/utils';

/*
terraform {
  required_version = ">= 0.12"
  backend "s3" {
    bucket = "prefer-infrastructure-terraform-state"
    key    = "env-production.tfstate"
    region = "ap-southeast-2"
  }
}
 */

describe('stringifyProperty', () => {
  it.each<[PropertyOrNull]>([
    [['type', '"A"']],
    [['ttl', 300]],
    [['subnet_id', 'aws_subnet.my-subnet.id']],
    [['myProperty', null]],
    [
      [
        // block property
        'terraform', // {
        [['required_version', '">= 0.12"']]
        // }
      ]
    ],
    [
      [
        // block property
        'terraform', // {
        [null, ['required_version', '">= 0.12"'], null]
        // }
      ]
    ],
    [
      [
        // array property
        'records', // = [
        [
          // ['key', 'value'],
          'aws_route53_zone.summerfestival_co_nz.name_servers.0',
          'aws_route53_zone.summerfestival_co_nz.name_servers.1',
          'aws_route53_zone.summerfestival_co_nz.name_servers.2',
          'aws_route53_zone.summerfestival_co_nz.name_servers.3'
        ] // ]
      ]
    ],
    [
      [
        // array property
        'records', // = [
        [
          'aws_route53_zone.summerfestival_co_nz.name_servers.0',
          null, // newline
          'aws_route53_zone.summerfestival_co_nz.name_servers.1',
          null, // newline
          'aws_route53_zone.summerfestival_co_nz.name_servers.2',
          'aws_route53_zone.summerfestival_co_nz.name_servers.3'
        ] // ]
      ]
    ]
  ])('stringifies expectedly', (property: PropertyOrNull) => {
    expect(stringifyProperty(property)).toMatchSnapshot();
  });
});
