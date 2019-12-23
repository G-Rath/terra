import { makeTFListExpression, makeTFSimpleLiteral } from '@src/makers';
import { printTFListExpression } from '@src/printer';
import { TFNodeType } from '@src/types';

describe('printTFListExpression', () => {
  it('prints a single simple value correctly', () => {
    expect(
      printTFListExpression(
        makeTFListExpression(['aws_route53_zone.my_zone.name'], false)
      )
    ).toMatchInlineSnapshot(`"[aws_route53_zone.my_zone.name]"`);
  });

  it('prints multiple simple values correctly', () => {
    expect(
      printTFListExpression(
        makeTFListExpression(
          [
            makeTFSimpleLiteral(
              'aws_route53_zone.my_zone.name_servers.0', //
              { leadingOuterText: '\n  ' }
            ),
            makeTFSimpleLiteral(
              'aws_route53_zone.my_zone.name_servers.1', //
              { leadingOuterText: '\n  ' }
            ),
            makeTFSimpleLiteral(
              'aws_route53_zone.my_zone.name_servers.2', //
              { leadingOuterText: '\n  ' }
            ),
            makeTFSimpleLiteral(
              'aws_route53_zone.my_zone.name_servers.3', //
              { leadingOuterText: '\n  ' }
            )
          ],
          false,
          { trailingInnerText: '\n' }
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
                makeTFSimpleLiteral(
                  'aws_subnet.private_a.id', //
                  { leadingOuterText: '\n    ' }
                ),
                makeTFSimpleLiteral(
                  'aws_subnet.private_b.id', //
                  { leadingOuterText: '\n    ' }
                ),
                makeTFSimpleLiteral('aws_subnet.private_c.id', {
                  leadingOuterText: '\n    '
                })
              ],
              true,
              {
                leadingOuterText: '\n  ',
                trailingInnerText: '\n  '
              }
            ),
            makeTFListExpression(
              [
                makeTFSimpleLiteral(
                  'aws_subnet.public_a.id', //
                  { leadingOuterText: '\n    ' }
                ),
                makeTFSimpleLiteral(
                  'aws_subnet.public_b.id', //
                  { leadingOuterText: '\n    ' }
                ),
                makeTFSimpleLiteral(
                  'aws_subnet.public_c.id', //
                  { leadingOuterText: '\n    ' }
                )
              ],
              false,
              {
                leadingOuterText: '\n  ',
                trailingInnerText: '\n  '
              }
            )
          ],
          false,
          { trailingInnerText: '\n' }
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
                ['Name', makeTFSimpleLiteral('"MyName"')],
                ['TTL', makeTFSimpleLiteral('300')]
              ]
            }
          ],
          false
        )
      )
    ).toMatchInlineSnapshot(`
      "[{
        Name = \\"MyName\\"
        TTL = 300
      }]"
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
                makeTFSimpleLiteral(
                  'aws_subnet.private_a.id', //
                  { leadingOuterText: '\n    ' }
                ),
                makeTFSimpleLiteral(
                  'aws_subnet.private_b.id', //
                  { leadingOuterText: '\n    ' }
                ),
                makeTFSimpleLiteral(
                  'aws_subnet.private_c.id', //
                  { leadingOuterText: '\n    ' }
                )
              ],
              true,
              {
                leadingOuterText: '\n  ',
                trailingInnerText: '\n  '
              }
            ),
            {
              type: TFNodeType.Function,
              name: 'map',
              args: []
            }
          ],
          false,
          { trailingInnerText: '\n' }
        )
      )
    ).toMatchInlineSnapshot(`
      "[
        [
          aws_subnet.private_a.id,
          aws_subnet.private_b.id,
          aws_subnet.private_c.id,
        ],map(
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
            makeTFListExpression(
              [
                makeTFSimpleLiteral(
                  'aws_subnet.private_a.id', //
                  { leadingOuterText: '\n    ' }
                ),
                makeTFSimpleLiteral(
                  'aws_subnet.private_b.id', //
                  { leadingOuterText: '\n    ' }
                ),
                makeTFSimpleLiteral(
                  'aws_subnet.private_c.id', //
                  { leadingOuterText: '\n    ' }
                )
              ],
              false,
              {
                leadingOuterText: '\n  ',
                trailingInnerText: '\n  '
              }
            ),
            makeTFSimpleLiteral('true'),
            makeTFSimpleLiteral('300'),
            {
              type: TFNodeType.Map,
              attributes: [
                [
                  'MyMap',
                  {
                    type: TFNodeType.Map,
                    attributes: [
                      ['Enabled', makeTFSimpleLiteral('false')],
                      ['TTL', makeTFSimpleLiteral('300')],
                      [
                        'MyList',
                        makeTFListExpression(
                          [
                            makeTFSimpleLiteral(
                              'aws_subnet.private_a.id', //
                              { leadingOuterText: '\n    ' }
                            ),
                            makeTFSimpleLiteral(
                              'aws_subnet.private_b.id', //
                              { leadingOuterText: '\n    ' }
                            ),
                            makeTFSimpleLiteral(
                              'aws_subnet.private_c.id', //
                              { leadingOuterText: '\n    ' }
                            )
                          ],
                          true,
                          {
                            leadingOuterText: '\n  ',
                            trailingInnerText: '\n  '
                          }
                        )
                      ]
                    ]
                  }
                ]
              ]
            }
          ],
          false,
          { trailingInnerText: '\n' }
        )
      )
    ).toMatchInlineSnapshot(`
      "[
        [
          aws_subnet.private_a.id,
          aws_subnet.private_b.id,
          aws_subnet.private_c.id
        ],true,300,{
        MyMap = {
          Enabled = false
          TTL = 300
          MyList =
            [
              aws_subnet.private_a.id,
              aws_subnet.private_b.id,
              aws_subnet.private_c.id,
            ]
        }
      }
      ]"
    `);
  });
});
