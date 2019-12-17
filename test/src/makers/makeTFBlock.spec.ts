import {
  makeTFBlock,
  makeTFBlockBody,
  makeTFLabel,
  makeTFStringArgument
} from '@src/makers';
import { TFBlock, TFNodeType } from '@src/types';

describe('makeTFBlock', () => {
  it('makes a TFBlock', () => {
    expect(
      makeTFBlock(
        'module', //
        [makeTFLabel('my-module')],
        makeTFBlockBody([]),
        {
          leadingOuterText: 'hello world',
          trailingOuterText: 'hello sunshine'
        }
      )
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

  describe('when labels include a string', () => {
    it('turns them into TFLabel nodes', () => {
      expect(
        makeTFBlock(
          'module', //
          ['my-module'],
          makeTFBlockBody([]),
          {
            leadingOuterText: 'hello world',
            trailingOuterText: 'hello sunshine'
          }
        )
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
        makeTFBlock(
          'module', //
          [makeTFLabel('my-module')],
          [makeTFStringArgument('hello', 'world')]
        )
      ).toStrictEqual<TFBlock>({
        type: TFNodeType.Block,
        blockType: 'module',
        labels: [makeTFLabel('my-module')],
        body: makeTFBlockBody([makeTFStringArgument('hello', 'world')]),
        surroundingText: {
          leadingOuterText: '',
          trailingOuterText: ''
        }
      });
    });
  });
});
