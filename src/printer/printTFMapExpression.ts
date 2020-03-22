import { printTFAttribute } from '@src/printer';
import type { TFMapExpression } from '@src/types';

export const printTFMapExpression = (map: TFMapExpression): string =>
  [
    map.surroundingText.leadingOuterText,
    '{',
    map.surroundingText.leadingInnerText,
    ...map.attributes.map(printTFAttribute),
    map.surroundingText.trailingInnerText,
    '}',
    map.surroundingText.trailingOuterText
  ].join('');
