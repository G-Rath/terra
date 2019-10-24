import { printLiteralExpression, printPrimitiveLiteral } from '@src/printers';
import {
  TFLiteralExpression,
  TFNodeType,
  TFPrimitiveLiteral
} from '@src/types';
import { mocked } from 'ts-jest/utils';

jest.mock('@src/printers/printPrimitiveLiteral');

describe('printLiteralExpression', () => {
  beforeEach(() =>
    mocked(printPrimitiveLiteral).mockReturnValue(nameof(printPrimitiveLiteral))
  );

  describe('when literal is a primitive', () => {
    it.each<TFLiteralExpression & TFPrimitiveLiteral>([
      null,
      true,
      false,
      1,
      'aws_route53_zone.my_zone.name',
      '"192.168.1.42"',
      'hello world'
    ])('delegates to printLiteralExpression', value => {
      expect(printLiteralExpression(value)).toStrictEqual(
        nameof(printPrimitiveLiteral)
      );
    });
  });

  describe('when literal is an array', () => {
    it('prints single primitive element correctly', () => {
      expect(
        printLiteralExpression([
          'aws_route53_zone.my_zone.name' //
        ])
      ).toMatchSnapshot();
    });

    it('prints multiple primitive elements correctly', () => {
      expect(
        printLiteralExpression([
          'aws_route53_zone.my_zone.name_servers.0',
          'aws_route53_zone.my_zone.name_servers.1',
          'aws_route53_zone.my_zone.name_servers.2',
          'aws_route53_zone.my_zone.name_servers.3'
        ])
      ).toMatchSnapshot();
    });

    it('prints nested arrays correctly', () => {
      expect(
        printLiteralExpression([
          [
            'aws_subnet.private_a.id',
            'aws_subnet.private_b.id',
            'aws_subnet.private_c.id'
          ],
          [
            'aws_subnet.public_a.id',
            'aws_subnet.public_b.id',
            'aws_subnet.public_c.id'
          ]
        ])
      ).toMatchSnapshot();
    });

    it('prints map elements correctly', () => {
      expect(
        printLiteralExpression([
          {
            type: TFNodeType.Map,
            attributes: [
              ['Name', '"MyName"'], //
              ['TTL', 300]
            ]
          }
        ])
      ).toMatchSnapshot();
    });

    it('prints function elements correctly', () => {
      // todo: functions not yet supported properly
      expect(
        printLiteralExpression([
          [
            'aws_subnet.private_a.id',
            'aws_subnet.private_b.id',
            'aws_subnet.private_c.id'
          ],
          {
            type: TFNodeType.Function,
            name: 'map',
            args: []
          }
        ])
      ).toMatchSnapshot();
    });

    it('prints mixed elements correctly', () => {
      expect(
        printLiteralExpression([
          [
            'aws_subnet.private_a.id',
            'aws_subnet.private_b.id',
            'aws_subnet.private_c.id'
          ],
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
                      'MyArray',
                      [
                        'aws_subnet.public_a.id',
                        'aws_subnet.public_b.id',
                        'aws_subnet.public_c.id'
                      ]
                    ]
                  ]
                }
              ]
            ]
          }
        ])
      ).toMatchSnapshot();
    });
  });

  describe('when literal is a Map', () => {
    it('prints primitive attributes correctly', () => {
      expect(
        printLiteralExpression({
          type: TFNodeType.Map,
          attributes: [
            ['Name', '"MyName"'], //
            ['TTL', 300]
          ]
        })
      ).toMatchSnapshot();
    });

    it('prints array attributes correctly', () => {
      expect(
        printLiteralExpression({
          type: TFNodeType.Map,
          attributes: [
            [
              'MyArray',
              [
                'aws_subnet.public_a.id',
                'aws_subnet.public_b.id',
                'aws_subnet.public_c.id'
              ]
            ]
          ]
        })
      ).toMatchSnapshot();
    });

    it('prints function attributes correctly', () => {
      expect(
        printLiteralExpression({
          type: TFNodeType.Map,
          attributes: [
            [
              'MyFunction',
              {
                type: TFNodeType.Function,
                name: 'flatten',
                args: [
                  [
                    'MyArray',
                    [
                      'aws_subnet.public_a.id',
                      'aws_subnet.public_b.id',
                      'aws_subnet.public_c.id'
                    ]
                  ]
                ]
              }
            ]
          ]
        })
      ).toMatchSnapshot();
    });

    it('prints shallow maps correctly', () => {
      expect(
        printLiteralExpression({
          type: TFNodeType.Map,
          attributes: [
            [
              'MyMap',
              {
                type: TFNodeType.Map,
                attributes: [
                  ['Name', '"MyName"'], //
                  ['TTL', 300]
                ]
              }
            ]
          ]
        })
      ).toMatchSnapshot();
    });

    it('prints nested maps correctly', () => {
      expect(
        printLiteralExpression({
          type: TFNodeType.Map,
          attributes: [
            [
              'MyMap',
              {
                type: TFNodeType.Map,
                attributes: [
                  ['Name', '"MyName"'], //
                  ['TTL', 300]
                ]
              }
            ]
          ]
        })
      ).toMatchSnapshot();
    });

    it('prints a mixed map correctly', () => {
      expect(
        printLiteralExpression({
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
                    'MyArray',
                    [
                      'aws_subnet.public_a.id',
                      'aws_subnet.public_b.id',
                      'aws_subnet.public_c.id'
                    ]
                  ]
                ]
              }
            ]
          ]
        })
      ).toMatchSnapshot();
    });
  });
});
