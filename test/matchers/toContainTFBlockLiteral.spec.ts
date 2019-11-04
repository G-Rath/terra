import { TFBlockBody } from '@src/types';
import { makeTFBlockLiteral } from '@src/utils';

import './toContainTFBlockLiteral';

describe('toContainTFBlockLiteral', () => {
  const ingressBlockLiteral = makeTFBlockLiteral('ingress', []);

  describe('positive', () => {
    describe('when body contains no block literals with the given name', () => {
      it('fails', () => {
        const body = [ingressBlockLiteral];

        expect(() => {
          expect<TFBlockBody>(body).toContainTFBlockLiteral('egress');
        }).toThrow('Body contains zero block literals with the expected name.');
      });
    });

    describe('when body contains one block literal with the given name', () => {
      it('passes', () => {
        const body = [ingressBlockLiteral];

        expect(() => {
          expect<TFBlockBody>(body).toContainTFBlockLiteral('ingress');
        }).not.toThrow();
      });
    });

    describe('when body contains multiple block literals with the given name', () => {
      it('fails', () => {
        const body = [ingressBlockLiteral, ingressBlockLiteral];

        expect(() => {
          expect<TFBlockBody>(body).toContainTFBlockLiteral('ingress');
        }).toThrow('Body contains two block literals with the expected name.');
      });
    });

    describe('when using expect.any for the name', () => {
      describe('when the body has at least one block literal', () => {
        it('passes', () => {
          const body = [ingressBlockLiteral];

          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlockLiteral(
              expect.any(String)
            );
          }).not.toThrow();
        });
      });

      describe('when the body has more than one block literal', () => {
        it('passes', () => {
          const body = [ingressBlockLiteral, ingressBlockLiteral];

          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlockLiteral(
              expect.any(String)
            );
          }).not.toThrow();
        });
      });

      describe('when the body has no block literals', () => {
        it('fails', () => {
          const body: TFBlockBody = [];

          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlockLiteral(
              expect.any(String)
            );
          }).toThrow(
            'Body contains zero block literals with the expected name.'
          );
        });
      });
    });
  });

  describe('negative', () => {
    describe('when body contains zero block literals with the given name', () => {
      it('passes', () => {
        const body = [ingressBlockLiteral];

        expect(() => {
          expect<TFBlockBody>(body).not.toContainTFBlockLiteral('egress');
        }).not.toThrow();
      });
    });

    describe('when body contains any block literal with the given name', () => {
      it('fails', () => {
        const body = [ingressBlockLiteral, ingressBlockLiteral];

        expect(() => {
          expect<TFBlockBody>(body).not.toContainTFBlockLiteral('ingress');
        }).toThrow('Body contains two block literals with the expected name.');
      });
    });
  });
});
