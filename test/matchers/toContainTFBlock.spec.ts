import { makeTFBlock, makeTFBlockBody } from '@src/makers';
import type { TFBlockBody } from '@src/types';

import './toContainTFBlock';

describe('toContainTFBlock', () => {
  const ingressBlock = makeTFBlock('ingress', [], []);

  describe('positive', () => {
    describe('when body contains no blocks with the given name', () => {
      it('fails', () => {
        const body = makeTFBlockBody([ingressBlock]);

        expect(() => {
          expect<TFBlockBody>(body).toContainTFBlock('egress');
        }).toThrow('Body contains zero blocks with the expected name.');
      });
    });

    describe('when body contains one block with the given name', () => {
      it('passes', () => {
        const body = makeTFBlockBody([ingressBlock]);

        expect(() => {
          expect<TFBlockBody>(body).toContainTFBlock('ingress');
        }).not.toThrow();
      });
    });

    describe('when body contains multiple blocks with the given name', () => {
      it('fails', () => {
        const body = makeTFBlockBody([ingressBlock, ingressBlock]);

        expect(() => {
          expect<TFBlockBody>(body).toContainTFBlock('ingress');
        }).toThrow('Body contains two blocks with the expected name.');
      });
    });

    describe('when using expect.any for the name', () => {
      describe('when the body has at least one block', () => {
        it('passes', () => {
          const body = makeTFBlockBody([ingressBlock]);

          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlock(expect.any(String));
          }).not.toThrow();
        });
      });

      describe('when the body has more than one block', () => {
        it('passes', () => {
          const body = makeTFBlockBody([ingressBlock, ingressBlock]);

          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlock(expect.any(String));
          }).not.toThrow();
        });
      });

      describe('when the body has no blocks', () => {
        it('fails', () => {
          const body = makeTFBlockBody([]);

          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlock(expect.any(String));
          }).toThrow('Body contains zero blocks with the expected name.');
        });
      });
    });
  });

  describe('negative', () => {
    describe('when body contains no blocks with the given name', () => {
      it('passes', () => {
        const body = makeTFBlockBody([ingressBlock]);

        expect(() => {
          expect<TFBlockBody>(body).not.toContainTFBlock('egress');
        }).not.toThrow();
      });
    });

    describe('when body contains any block with the given name', () => {
      it('fails', () => {
        const body = makeTFBlockBody([ingressBlock, ingressBlock]);

        expect(() => {
          expect<TFBlockBody>(body).not.toContainTFBlock('ingress');
        }).toThrow('Body contains two blocks with the expected name.');
      });
    });
  });
  describe('when the expected is not a TFBlockBody', () => {
    it('fails', () => {
      expect(() => {
        expect(1).toContainTFBlock('alias');
      }).toThrow("Received isn't a Body");
    });
  });
});
