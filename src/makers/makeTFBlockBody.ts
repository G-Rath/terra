import { TFBlockBody, TFBlockBodyBody, TFNodeType } from '@src/types';

export const makeTFBlockBody = <TIdentifier extends string = string>(
  body: TFBlockBodyBody<TIdentifier>,
  surroundingText?: Partial<TFBlockBody['surroundingText']>
): TFBlockBody<TIdentifier> => ({
  type: TFNodeType.Body,
  body,
  surroundingText: {
    leadingInnerText: '',
    leadingOuterText: '',
    trailingInnerText: '',
    trailingOuterText: '',
    ...surroundingText
  }
});
