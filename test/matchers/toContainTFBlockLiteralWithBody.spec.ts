import {
  makeTFArgument,
  makeTFBlockLiteral,
  makeTFStringArgument
} from '@src/makers';
import { TFBlockBody } from '@src/types';

import './toContainTFBlockLiteralWithBody';

describe('toContainTFBlockLiteralWithBody', () => {
  const ingressBlockLiteral = makeTFBlockLiteral('ingress', []);

  describe('toContainTFBlockLiteral-like behaviour', () => {
    describe('positive', () => {
      describe('when body contains no block literals with the given name', () => {
        it('fails', () => {
          const body = [ingressBlockLiteral];

          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlockLiteralWithBody(
              'egress',
              expect.any(Array)
            );
          }).toThrow(
            'Body contains zero block literals with the expected name.'
          );
        });
      });

      describe('when body contains one block literal with the given name', () => {
        it('passes', () => {
          const body = [ingressBlockLiteral];

          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlockLiteralWithBody(
              'ingress',
              expect.any(Array)
            );
          }).not.toThrow();
        });
      });

      describe('when body contains multiple block literals with the given name', () => {
        it('fails', () => {
          const body = [ingressBlockLiteral, ingressBlockLiteral];

          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlockLiteralWithBody(
              'ingress',
              expect.any(Array)
            );
          }).toThrow(
            'Body contains two block literals with the expected name.'
          );
        });
      });

      describe('when using expect.any for the name', () => {
        describe('when the body has at least one block literal', () => {
          it('passes', () => {
            const body = [ingressBlockLiteral];

            expect(() => {
              expect<TFBlockBody>(body).toContainTFBlockLiteralWithBody(
                expect.any(String),
                expect.any(Array)
              );
            }).not.toThrow();
          });
        });

        describe('when the body has more than one block literal', () => {
          it('passes', () => {
            const body = [ingressBlockLiteral, ingressBlockLiteral];

            expect(() => {
              expect<TFBlockBody>(body).toContainTFBlockLiteralWithBody(
                expect.any(String),
                expect.any(Array)
              );
            }).not.toThrow();
          });
        });

        describe('when the body has no block literals', () => {
          it('fails', () => {
            const body: TFBlockBody = [];

            expect(() => {
              expect<TFBlockBody>(body).toContainTFBlockLiteralWithBody(
                expect.any(String),
                expect.any(Array)
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
            expect<TFBlockBody>(body).not.toContainTFBlockLiteralWithBody(
              'egress',
              expect.any(Array)
            );
          }).not.toThrow();
        });
      });

      describe('when body contains any block literal with the given name', () => {
        it('fails', () => {
          const body = [ingressBlockLiteral, ingressBlockLiteral];

          expect(() => {
            expect<TFBlockBody>(body).not.toContainTFBlockLiteralWithBody(
              'ingress',
              expect.any(Array)
            );
          }).toThrow(
            'Body contains two block literals with the expected name.'
          );
        });
      });
    });
  });
  describe('WithBody behaviour', () => {
    describe('when all the elements are present', () => {
      const blockBody = [
        makeTFStringArgument('zone_id', 'Z2FDTNDATAQYW2'),
        makeTFStringArgument('name', 'd1qgcauaj18ot9.cloudfront.net.'),
        makeTFArgument('evaluate_target_health', false)
      ];

      const body = [makeTFBlockLiteral('alias', blockBody)];

      describe('and in the right order', () => {
        it('passes', () => {
          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlockLiteralWithBody(
              'alias',
              blockBody
            );
          }).not.toThrow();
        });
      });

      describe('but in the wrong order', () => {
        it('fails', () => {
          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlockLiteralWithBody(
              'alias',
              [...blockBody].reverse()
            );
          }).toThrow('');
        });
      });
    });

    describe('when some of the elements are missing', () => {
      const blockBody = [
        makeTFStringArgument('zone_id', 'Z2FDTNDATAQYW2'),
        makeTFStringArgument('name', 'd1qgcauaj18ot9.cloudfront.net.'),
        makeTFArgument('evaluate_target_health', false)
      ];

      const body = [makeTFBlockLiteral('alias', blockBody)];

      it('fails', () => {
        expect(() => {
          expect<TFBlockBody>(body).toContainTFBlockLiteralWithBody(
            'alias',
            [...blockBody].slice(1)
          );
        }).toThrow('Block literal body does not match as expected.');
      });
    });
  });
});
