import { makeTFBlockBody, makeTFLabel, makeTFModuleBlock } from '@src/makers';
import { TFBlock, TFModuleBlock, TFNodeType } from '@src/types';

describe('makeTFModuleBlock', () => {
  it('makes a TFModuleBlock', () => {
    expect(
      makeTFModuleBlock(
        makeTFLabel('ingress'), //
        makeTFBlockBody([]),
        { leadingOuterText: '/* hello world */' }
      )
    ).toStrictEqual<TFModuleBlock>({
      type: TFNodeType.Block,
      blockType: 'module',
      labels: [makeTFLabel('ingress')],
      body: makeTFBlockBody([]),
      surroundingText: {
        leadingOuterText: '/* hello world */',
        trailingOuterText: ''
      }
    });
  });

  describe('when "name" is a string', () => {
    it('makes it a TFLabel node', () => {
      expect(
        makeTFModuleBlock('my-module', makeTFBlockBody([]), {
          leadingOuterText: 'hello world',
          trailingOuterText: 'hello sunshine'
        })
      ).toStrictEqual<TFBlock>({
        type: TFNodeType.Block,
        blockType: 'module',
        labels: [makeTFLabel('my-module')],
        body: makeTFBlockBody([]),
        surroundingText: {
          leadingOuterText: 'hello world',
          trailingOuterText: 'hello sunshine'
        }
      });
    });
  });

  describe('when "body" is an array', () => {
    it('makes it into a TFBlockBody node', () => {
      expect(
        makeTFModuleBlock(
          makeTFLabel('ingress'), //
          [],
          { leadingOuterText: '/* hello sunshine */' }
        )
      ).toStrictEqual<TFModuleBlock>({
        type: TFNodeType.Block,
        blockType: 'module',
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
