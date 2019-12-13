import { makeTFBlockBody } from '@src/makers';
import { TFBlockBody, TFBlockBodyBody, TFNodeType } from '@src/types';

describe('makeTFBlockBody', () => {
  it('makes a TFBlockBody', () => {
    const body: TFBlockBodyBody = [];

    expect(
      makeTFBlockBody(body, {
        leadingInnerText: 'hello world',
        trailingInnerText: 'hello sunshine'
      })
    ).toStrictEqual<TFBlockBody>({
      type: TFNodeType.Body,
      body,
      surroundingText: {
        leadingInnerText: 'hello world',
        leadingOuterText: '',
        trailingInnerText: 'hello sunshine',
        trailingOuterText: ''
      }
    });
  });
});
