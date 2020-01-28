import {
  makeTFArgument,
  makeTFBlock,
  makeTFBlockBody,
  makeTFStringArgument
} from '@src/makers';
import { TFBlockBody } from '@src/types';

import './toContainTFBlockWithBody';

describe('toContainTFBlockWithBody', () => {
  const ingressBlock = makeTFBlock('ingress', [], []);

  describe('toContainTFBlock-like behaviour', () => {
    describe('positive', () => {
      describe('when body contains no blocks with the given name', () => {
        it('fails', () => {
          const body = makeTFBlockBody([ingressBlock]);

          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlockWithBody(
              'egress',
              expect.any(Array)
            );
          }).toThrow('Body contains zero blocks with the expected name.');
        });
      });

      describe('when body contains one block with the given name', () => {
        it('passes', () => {
          const body = makeTFBlockBody([ingressBlock]);

          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlockWithBody(
              'ingress',
              expect.any(Array)
            );
          }).not.toThrow();
        });
      });

      describe('when body contains multiple blocks with the given name', () => {
        it('fails', () => {
          const body = makeTFBlockBody([ingressBlock, ingressBlock]);

          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlockWithBody(
              'ingress',
              expect.any(Array)
            );
          }).toThrow('Body contains two blocks with the expected name.');
        });
      });

      describe('when using expect.any for the name', () => {
        describe('when the body has at least one block', () => {
          it('passes', () => {
            const body = makeTFBlockBody([ingressBlock]);

            expect(() => {
              expect<TFBlockBody>(body).toContainTFBlockWithBody(
                expect.any(String),
                expect.any(Array)
              );
            }).not.toThrow();
          });
        });

        describe('when the body has more than one block', () => {
          it('passes', () => {
            const body = makeTFBlockBody([ingressBlock, ingressBlock]);

            expect(() => {
              expect<TFBlockBody>(body).toContainTFBlockWithBody(
                expect.any(String),
                expect.any(Array)
              );
            }).not.toThrow();
          });
        });

        describe('when the body has no blocks', () => {
          it('fails', () => {
            const body = makeTFBlockBody([]);

            expect(() => {
              expect<TFBlockBody>(body).toContainTFBlockWithBody(
                expect.any(String),
                expect.any(Array)
              );
            }).toThrow('Body contains zero blocks with the expected name.');
          });
        });
      });
    });

    describe('negative', () => {
      describe('when body contains zero blocks with the given name', () => {
        it('passes', () => {
          const body = makeTFBlockBody([ingressBlock]);

          expect(() => {
            expect<TFBlockBody>(body).not.toContainTFBlockWithBody(
              'egress',
              expect.any(Array)
            );
          }).not.toThrow();
        });
      });

      describe('when body contains any block with the given name', () => {
        it('fails', () => {
          const body = makeTFBlockBody([ingressBlock, ingressBlock]);

          expect(() => {
            expect<TFBlockBody>(body).not.toContainTFBlockWithBody(
              'ingress',
              expect.any(Array)
            );
          }).toThrow('Body contains two blocks with the expected name.');
        });
      });
    });
  });

  describe('WithBody behaviour', () => {
    describe('when all the elements are present', () => {
      const blockBody = [
        makeTFStringArgument('zone_id', 'Z2FDTNDATAQYW2'),
        makeTFStringArgument('name', 'd1qgcauaj18ot9.cloudfront.net.'),
        makeTFArgument('evaluate_target_health', 'false')
      ];

      const body = makeTFBlockBody([makeTFBlock('alias', [], blockBody)]);

      describe('and in the right order', () => {
        it('passes', () => {
          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlockWithBody(
              'alias',
              blockBody
            );
          }).not.toThrow();
        });
      });

      describe('but in the wrong order', () => {
        it('fails', () => {
          expect(() => {
            expect<TFBlockBody>(body).toContainTFBlockWithBody(
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
        makeTFArgument('evaluate_target_health', 'false')
      ];

      const body = makeTFBlockBody([makeTFBlock('alias', [], blockBody)]);

      it('fails', () => {
        expect(() => {
          expect<TFBlockBody>(body).toContainTFBlockWithBody(
            'alias',
            [...blockBody].slice(1)
          );
        }).toThrow('Block body does not match as expected.');
      });
    });
  });

  describe('when the expected is not a TFBlockBody', () => {
    it('fails', () => {
      expect(() => {
        expect(
          makeTFArgument('evaluate_target_health', 'false')
        ).toContainTFBlockWithBody('alias', []);
      }).toThrow("Received isn't a Body");
    });
  });
});
