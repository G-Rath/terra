import { TFBlockBody } from '@src/types';
import { makeTFDynamicBlock } from '@src/utils';

import './toContainTFDynamicBlock';

describe('toContainTFDynamicBlock', () => {
  const ingressDynamicBlock = makeTFDynamicBlock('ingress', []);

  describe('positive', () => {
    describe('when body contains no dynamic blocks with the given name', () => {
      it('fails', () => {
        const body = [ingressDynamicBlock];

        expect(() => {
          expect<TFBlockBody>(body).toContainTFDynamicBlock('egress');
        }).toThrow('Body contains zero dynamic blocks with the expected name.');
      });
    });

    describe('when body contains one dynamic block with the given name', () => {
      it('passes', () => {
        const body = [ingressDynamicBlock];

        expect(() => {
          expect<TFBlockBody>(body).toContainTFDynamicBlock('ingress');
        }).not.toThrow();
      });
    });

    describe('when body contains multiple dynamic blocks with the given name', () => {
      it('fails', () => {
        const body = [ingressDynamicBlock, ingressDynamicBlock];

        expect(() => {
          expect<TFBlockBody>(body).toContainTFDynamicBlock('ingress');
        }).toThrow('Body contains two dynamic blocks with the expected name.');
      });
    });

    describe('when using expect.any for the name', () => {
      describe('when the body has only one dynamic block', () => {
        it('passes', () => {
          const body = [ingressDynamicBlock, ingressDynamicBlock];

          expect(() => {
            expect<TFBlockBody>(body).toContainTFDynamicBlock(
              expect.any(String)
            );
          }).not.toThrow();
        });
      });

      describe('when the body has more than one dynamic block', () => {
        it('passes', () => {
          const body = [ingressDynamicBlock, ingressDynamicBlock];

          expect(() => {
            expect<TFBlockBody>(body).toContainTFDynamicBlock(
              expect.any(String)
            );
          }).not.toThrow();
        });
      });

      describe('when the body has no dynamic blocks', () => {
        it('fails', () => {
          const body: TFBlockBody = [];

          expect(() => {
            expect<TFBlockBody>(body).toContainTFDynamicBlock(
              expect.any(String)
            );
          }).toThrow(
            'Body contains zero dynamic blocks with the expected name.'
          );
        });
      });
    });
  });

  describe('negative', () => {
    describe('when body contains zero dynamic blocks with the given name', () => {
      it('passes', () => {
        const body = [ingressDynamicBlock];

        expect(() => {
          expect<TFBlockBody>(body).not.toContainTFDynamicBlock('egress');
        }).not.toThrow();
      });
    });

    describe('when body contains any dynamic block with the given name', () => {
      it('fails', () => {
        const body = [ingressDynamicBlock, ingressDynamicBlock];

        expect(() => {
          expect<TFBlockBody>(body).not.toContainTFDynamicBlock('ingress');
        }).toThrow('Body contains two dynamic blocks with the expected name.');
      });
    });
  });
});
