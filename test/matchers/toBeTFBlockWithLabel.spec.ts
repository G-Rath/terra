import { makeTFArgument, makeTFBlock, makeTFLabel } from '@src/makers';

import './toBeTFBlockWithLabel';

describe('toBeTFBlockWithLabel', () => {
  describe('when the label at the given position has the value', () => {
    it('passes', () => {
      const block = makeTFBlock('resource', ['my_label'], []);

      expect(() => {
        expect(block).toBeTFBlockWithLabel('my_label', 0);
      }).not.toThrow();
    });
  });

  describe('when the label at the given position has a different value', () => {
    it('passes', () => {
      const block = makeTFBlock(
        'resource',
        ['my_label_1', 'my_label_2', 'my_label_3'],
        []
      );

      expect(() => {
        expect(block).toBeTFBlockWithLabel('my_label', 2);
      }).toThrow('Labels are not equal');
    });
  });

  describe('when the block has fewer labels than "position"', () => {
    it('fails', () => {
      const block = makeTFBlock('resource', [], []);

      expect(() => {
        expect(block).toBeTFBlockWithLabel('my_label', 2);
      }).toThrow('Block contains fewer labels than expected.');
    });
  });

  describe('when the label is a TFLabel node', () => {
    it('can fail due to surrounding text', () => {
      const block = makeTFBlock('resource', ['my_label_1'], []);

      expect(() => {
        expect(block).toBeTFBlockWithLabel(
          makeTFLabel('my_label_1', { leadingOuterText: ' ' }),
          0
        );
      }).toThrow('Labels are not equal');
    });
  });

  describe('when the expected is not a TFBlock', () => {
    it('fails', () => {
      const block = makeTFArgument('hello', 'world');

      expect(() => {
        expect(block).toBeTFBlockWithLabel('my_label', 0);
      }).toThrow("Received isn't a Block.");
    });

    it('fails on null', () => {
      expect(() => {
        expect(null).toBeTFBlockWithLabel('my_label', 0);
      }).toThrow("Received isn't a Block.");
    });
  });
});
