import { makeTFBlockBody, makeTFDynamicBlock, makeTFLabel } from '@src/makers';
import { TFDynamicBlock, TFNodeType } from '@src/types';

describe('makeTFDynamicBlock', () => {
  it('makes a TFDynamicBlock', () => {
    expect(
      makeTFDynamicBlock('ingress', makeTFBlockBody([]), {
        leadingOuterText: '/* hello world */'
      })
    ).toStrictEqual<TFDynamicBlock>({
      type: TFNodeType.Block,
      blockType: 'dynamic',
      labels: [makeTFLabel('ingress')],
      body: makeTFBlockBody([]),
      surroundingText: {
        leadingOuterText: '/* hello world */',
        trailingOuterText: ''
      }
    });
  });

  describe('when "body" is an array', () => {
    it('makes it into a TFBlockBody node', () => {
      expect(
        makeTFDynamicBlock('ingress', [], {
          leadingOuterText: '/* hello sunshine */'
        })
      ).toStrictEqual<TFDynamicBlock>({
        type: TFNodeType.Block,
        blockType: 'dynamic',
        labels: [makeTFLabel('ingress')],
        body: makeTFBlockBody([]),
        surroundingText: {
          leadingOuterText: '/* hello sunshine */',
          trailingOuterText: ''
        }
      });
    });
  });
});
