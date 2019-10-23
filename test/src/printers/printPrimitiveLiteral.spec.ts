import { printPrimitiveLiteral } from '@src/printers';
import { TFPrimitiveLiteral } from '@src/types';

describe('printPrimitiveLiteral', () => {
  it.each<[TFPrimitiveLiteral, string]>([
    [null, 'null'],
    [true, 'true'],
    [false, 'false'],
    [1, '1'],
    ['aws_route53_zone.my_zone.name', 'aws_route53_zone.my_zone.name'],
    ['"192.168.1.42"', '"192.168.1.42"']
  ])('prints expectedly', (value, expected) => {
    expect(printPrimitiveLiteral(value)).toStrictEqual(expected);
  });
});
