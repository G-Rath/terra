import { printTFArgument } from '@src/printer/printTFArgument';
import { printTFBlock } from '@src/printer/printTFBlock';
import { TFBlockBody, TFNodeType } from '@src/types';

export const printTFBlockBody = (body: TFBlockBody): string => {
  return [
    body.surroundingText.leadingOuterText,
    '{',
    body.surroundingText.leadingInnerText,
    ...body.body.map(value =>
      value.type === TFNodeType.Block
        ? printTFBlock(value)
        : printTFArgument(value)
    ),
    body.surroundingText.trailingInnerText,
    '}',
    body.surroundingText.trailingOuterText
  ].join('');
};
