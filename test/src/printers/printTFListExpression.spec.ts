import { makeTFListExpression } from '@src/makers';
import { printTFListExpression } from '@src/printers';
import { TFNodeType } from '@src/types';

describe('printTFListExpression', () => {
  it('prints a single primitive value correctly', () => {
    expect(
      printTFListExpression(
        makeTFListExpression(
          ['aws_route53_zone.my_zone.name'], //
          false
        )
      )
    ).toMatchInlineSnapshot(`
        "[
          aws_route53_zone.my_zone.name
        ]"
      `);
  });

  it('prints multiple primitive values correctly', () => {
    expect(
      printTFListExpression(
        makeTFListExpression(
          [
            'aws_route53_zone.my_zone.name_servers.0',
            'aws_route53_zone.my_zone.name_servers.1',
            'aws_route53_zone.my_zone.name_servers.2',
            'aws_route53_zone.my_zone.name_servers.3'
          ],
          false
        )
      )
    ).toMatchInlineSnapshot(`
        "[
          aws_route53_zone.my_zone.name_servers.0,
          aws_route53_zone.my_zone.name_servers.1,
          aws_route53_zone.my_zone.name_servers.2,
          aws_route53_zone.my_zone.name_servers.3
        ]"
      `);
  });

  it('prints nested lists correctly', () => {
    expect(
      printTFListExpression(
        makeTFListExpression(
          [
            makeTFListExpression(
              [
                'aws_subnet.private_a.id',
                'aws_subnet.private_b.id',
                'aws_subnet.private_c.id'
              ],
              true
            ),
            makeTFListExpression(
              [
                'aws_subnet.public_a.id',
                'aws_subnet.public_b.id',
                'aws_subnet.public_c.id'
              ],
              false
            )
          ],
          false
        )
      )
    ).toMatchInlineSnapshot(`
      "[
        [
          aws_subnet.private_a.id,
          aws_subnet.private_b.id,
          aws_subnet.private_c.id,
        ],
        [
          aws_subnet.public_a.id,
          aws_subnet.public_b.id,
          aws_subnet.public_c.id
        ]
      ]"
    `);
  });

  it('prints map values correctly', () => {
    expect(
      printTFListExpression(
        makeTFListExpression(
          [
            {
              type: TFNodeType.Map,
              attributes: [
                ['Name', '"MyName"'],
                ['TTL', 300]
              ]
            }
          ],
          false
        )
      )
    ).toMatchInlineSnapshot(`
        "[
          {
            Name = \\"MyName\\"
            TTL = 300
          }
        ]"
      `);
  });

  it('prints function values correctly', () => {
    // todo: functions not yet supported properly
    expect(
      printTFListExpression(
        makeTFListExpression(
          [
            makeTFListExpression(
              [
                'aws_subnet.private_a.id',
                'aws_subnet.private_b.id',
                'aws_subnet.private_c.id'
              ],
              true
            ),
            {
              type: TFNodeType.Function,
              name: 'map',
              args: []
            }
          ],
          false
        )
      )
    ).toMatchInlineSnapshot(`
      "[
        [
          aws_subnet.private_a.id,
          aws_subnet.private_b.id,
          aws_subnet.private_c.id,
        ],
        map(
          # FIXME - FUNCTIONS NOT YET SUPPORTED
        )
      ]"
    `);
  });

  it('prints mixed values correctly', () => {
    expect(
      printTFListExpression(
        makeTFListExpression(
          [
            makeTFListExpression([
              'aws_subnet.private_a.id',
              'aws_subnet.private_b.id',
              'aws_subnet.private_c.id'
            ]),
            true,
            300,
            {
              type: TFNodeType.Map,
              attributes: [
                [
                  'MyMap',
                  {
                    type: TFNodeType.Map,
                    attributes: [
                      ['Enabled', false],
                      ['TTL', 300],
                      [
                        'MyList',
                        makeTFListExpression(
                          [
                            'aws_subnet.public_a.id',
                            'aws_subnet.public_b.id',
                            'aws_subnet.public_c.id'
                          ],
                          true
                        )
                      ]
                    ]
                  }
                ]
              ]
            }
          ],
          false
        )
      )
    ).toMatchInlineSnapshot(`
      "[
        [
          aws_subnet.private_a.id,
          aws_subnet.private_b.id,
          aws_subnet.private_c.id
        ],
        true,
        300,
        {
          MyMap = {
            Enabled = false
            TTL = 300
            MyList = [
              aws_subnet.public_a.id,
              aws_subnet.public_b.id,
              aws_subnet.public_c.id,
            ]
          }
        }
      ]"
    `);
  });
});
