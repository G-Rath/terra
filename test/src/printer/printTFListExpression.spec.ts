import {
  makeTFAttribute,
  makeTFFunctionCall,
  makeTFListExpression,
  makeTFMapExpression,
  makeTFSimpleLiteral
} from '@src/makers';
import { printTFListExpression } from '@src/printer';

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
            makeTFMapExpression(
              ([
                ['Name', makeTFSimpleLiteral('"MyName"')], //
                ['TTL', makeTFSimpleLiteral('300')]
              ] as const).map(value => makeTFAttribute(value[0], value[1]))
            )
          ],
          false
        )
      )
    ).toMatchInlineSnapshot(`"[{Name=\\"MyName\\"TTL=300}]"`);
  });

  it('prints function values correctly', () => {
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
            makeTFFunctionCall('map', [], false)
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
        ],map()
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
            makeTFMapExpression([
              makeTFAttribute(
                'MyMap',
                makeTFMapExpression(
                  ([
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
                  ] as const).map(value => makeTFAttribute(value[0], value[1]))
                )
              )
            ])
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
        ],true,300,{MyMap={Enabled=falseTTL=300MyList=
        [
          aws_subnet.private_a.id,
          aws_subnet.private_b.id,
          aws_subnet.private_c.id,
        ]}}
      ]"
    `);
  });
});
