import {
  makeTFAttribute,
  makeTFFunctionCall,
  makeTFIdentifier,
  makeTFListExpression,
  makeTFMapExpression,
  makeTFSimpleLiteral
} from '@src/makers';
import { printTFFunctionCall } from '@src/printer';

describe('printTFFunctionCall', () => {
  it('prints leadingOuterText after the function name but before the opening parenthesis', () => {
    expect(
      printTFFunctionCall(
        makeTFFunctionCall('', [], false, {
          leadingOuterText: ' hello world '
        })
      )
    ).toMatch(/^ hello world \(/u);
  });

  it('prints leadingInnerText after the opening parenthesis', () => {
    expect(
      printTFFunctionCall(
        makeTFFunctionCall('', [], false, {
          leadingInnerText: ' hello world '
        })
      )
    ).toMatch(/^\( hello world /u);
  });

  it('prints empty args correctly', () => {
    expect(
      printTFFunctionCall(makeTFFunctionCall('trim', [], false))
    ).toMatchInlineSnapshot(`"trim()"`);
  });

  it('prints simple-type arguments correctly', () => {
    expect(
      printTFFunctionCall(
        makeTFFunctionCall(
          'trim',
          [makeTFSimpleLiteral('local.common_tags')],
          false
        )
      )
    ).toMatchInlineSnapshot(`"trim(local.common_tags)"`);
  });

  it('prints list-type arguments correctly', () => {
    expect(
      printTFFunctionCall(
        makeTFFunctionCall(
          'trim',
          [
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
          ],
          false
        )
      )
    ).toMatchInlineSnapshot(`
      "trim([
        aws_route53_zone.my_zone.name_servers.0,
        aws_route53_zone.my_zone.name_servers.1,
        aws_route53_zone.my_zone.name_servers.2,
        aws_route53_zone.my_zone.name_servers.3
      ])"
    `);
  });

  it('prints function-type arguments correctly', () => {
    expect(
      printTFFunctionCall(
        makeTFFunctionCall(
          'trim',
          [makeTFFunctionCall('trim', [makeTFSimpleLiteral('1')], false)],
          false
        )
      )
    ).toMatchInlineSnapshot(`"trim(trim(1))"`);
  });

  it('prints trailing commas correctly', () => {
    expect(
      printTFFunctionCall(
        makeTFFunctionCall(
          makeTFIdentifier('trim', { leadingOuterText: ' ' }), //
          [makeTFSimpleLiteral('common_tags', { leadingOuterText: '\n    ' })],
          true,
          {
            leadingInnerText: '',
            leadingOuterText: '',
            trailingInnerText: '\n  ',
            trailingOuterText: ''
          }
        )
      )
    ).toMatchInlineSnapshot(`
      " trim(
          common_tags,
        )"
    `);
  });
  it('prints map-type arguments correctly', () => {
    expect(
      printTFFunctionCall(
        makeTFFunctionCall(
          'trim',
          [
            makeTFMapExpression(
              ([
                ['name', makeTFSimpleLiteral('"MyName"')], //
                ['TTL', makeTFSimpleLiteral('300')]
              ] as const).map(value =>
                makeTFAttribute(
                  makeTFIdentifier(value[0], { leadingOuterText: '\n  ' }),
                  value[1],
                  {
                    leadingInnerText: ' ',
                    trailingInnerText: ' '
                  }
                )
              ),
              { trailingInnerText: '\n' }
            )
          ],
          false
        )
      )
    ).toMatchInlineSnapshot(`
      "trim({
        name = \\"MyName\\"
        TTL = 300
      })"
    `);
  });

  it('prints mixed-type arguments correctly', () => {
    expect(
      printTFFunctionCall(
        makeTFFunctionCall(
          'trim',
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
            makeTFSimpleLiteral('true', { leadingOuterText: '\n  ' }),
            makeTFSimpleLiteral('300', { leadingOuterText: '\n  ' }),
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
                          trailingInnerText: '\n  '
                        }
                      )
                    ]
                  ] as const).map(value =>
                    makeTFAttribute(
                      makeTFIdentifier(value[0], { leadingOuterText: '\n  ' }),
                      value[1],
                      {
                        leadingInnerText: ' ',
                        trailingInnerText: ' '
                      }
                    )
                  ),
                  { trailingInnerText: '\n' }
                )
              )
            ])
          ],
          false
        )
      )
    ).toMatchInlineSnapshot(`
      "trim(
        [
          aws_subnet.private_a.id,
          aws_subnet.private_b.id,
          aws_subnet.private_c.id
        ],
        true,
        300,{MyMap={
        Enabled = false
        TTL = 300
        MyList = [
          aws_subnet.private_a.id,
          aws_subnet.private_b.id,
          aws_subnet.private_c.id,
        ]
      }})"
    `);
  });

  it('prints trailingInnerText before the closing parenthesis', () => {
    expect(
      printTFFunctionCall(
        makeTFFunctionCall('', [], false, {
          trailingInnerText: ' hello world '
        })
      )
    ).toMatch(/ hello world \)$/u);
  });

  it('prints trailingOuterText after the closing parenthesis', () => {
    expect(
      printTFFunctionCall(
        makeTFFunctionCall('', [], false, {
          trailingOuterText: ' hello world '
        })
      )
    ).toMatch(/\) hello world $/u);
  });
});
