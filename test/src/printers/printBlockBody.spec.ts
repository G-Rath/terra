import { printBlockBody } from '@src/printers';
import { TFNodeType } from '@src/types';

describe('printBlockBody', () => {
  describe('when the body contains no elements', () => {
    it('prints empty braces on one line', () => {
      expect(printBlockBody([])).toMatchSnapshot();
    });
  });

  describe('when the body contains a single element', () => {
    describe('when the element is an argument', () => {
      it('prints as expected', () => {
        expect(
          printBlockBody([
            {
              type: TFNodeType.Argument,
              identifier: 'hello',
              expression: '"world"'
            }
          ])
        ).toMatchSnapshot();
      });
    });
  });
  describe('when the body contains multiple elements', () => {
    describe('when the elements are just arguments', () => {
      it('prints as expected', () => {
        expect(
          printBlockBody([
            {
              type: TFNodeType.Argument,
              identifier: 'hello',
              expression: '"world"'
            },
            {
              type: TFNodeType.Argument,
              identifier: 'enabled',
              expression: false
            },
            {
              type: TFNodeType.Argument,
              identifier: 'common_tags',
              expression: {
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
              }
            }
          ])
        ).toMatchSnapshot();
      });
    });
  });
});
