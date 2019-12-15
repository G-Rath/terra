import {
  makeTFArgument,
  makeTFBlockBody,
  makeTFStringArgument
} from '@src/makers';
import { TFBlockBody, TFBlockBodyBody } from '@src/types';

import './toContainTFArgumentWithExpression';

describe('toContainTFArgumentWithExpression', () => {
  const standardArgument = makeTFStringArgument('name', 'example.com');
  const expectedArgument = makeTFArgument('ttl', '300');

  describe('positive', () => {
    describe('when body contains no arguments with the given identifier', () => {
      it('fails', () => {
        const body = makeTFBlockBody([standardArgument]);

        expect(() => {
          expect<TFBlockBody>(body).toContainTFArgumentWithExpression(
            'ttl',
            '300'
          );
        }).toThrow(
          'Body contains zero arguments with the expected identifier.'
        );
      });
    });

    describe('when body contains one argument with the given identifier', () => {
      describe('when the argument has the expected expression', () => {
        it('passes', () => {
          const body = makeTFBlockBody([expectedArgument]);

          expect(() => {
            expect<TFBlockBody>(body).toContainTFArgumentWithExpression(
              'ttl',
              '300'
            );
          }).not.toThrow();
        });
      });

      describe('when the argument has an unexpected expression', () => {
        it('fails', () => {
          const body = makeTFBlockBody([expectedArgument]);

          expect(() => {
            expect<TFBlockBody>(body).toContainTFArgumentWithExpression(
              'ttl',
              '"300"'
            );
          }).toThrow('Argument has unexpected expression.');
        });
      });

      describe('when using expect.any for the expression', () => {
        it('passes', () => {
          const body = makeTFBlockBody([expectedArgument]);

          expect(() => {
            expect<TFBlockBody>(body).toContainTFArgumentWithExpression(
              'ttl',
              expect.stringMatching(/[\d]/)
            );
          }).not.toThrow();
        });
      });
    });

    describe('when body contains multiple arguments with the given identifier', () => {
      it('fails', () => {
        const body = makeTFBlockBody([expectedArgument, expectedArgument]);

        expect(() => {
          expect<TFBlockBody>(body).toContainTFArgumentWithExpression(
            'ttl',
            '300'
          );
        }).toThrow('Body contains two arguments with the expected identifier.');
      });
    });

    describe('when using expect.any for the identifier', () => {
      describe('when the body has only one argument', () => {
        it('passes', () => {
          const body = makeTFBlockBody([expectedArgument, expectedArgument]);

          expect(() => {
            expect<TFBlockBody>(body).toContainTFArgumentWithExpression(
              expect.any(String),
              '300'
            );
          }).not.toThrow();
        });
      });

      describe('when the body has more than one argument', () => {
        it('passes', () => {
          const body = makeTFBlockBody([expectedArgument, expectedArgument]);

          expect(() => {
            expect<TFBlockBody>(body).toContainTFArgumentWithExpression(
              expect.any(String),
              '300'
            );
          }).not.toThrow();
        });
      });

      describe('when the body has no arguments', () => {
        it('fails', () => {
          const body = makeTFBlockBody([]);

          expect(() => {
            expect<TFBlockBody>(body).toContainTFArgumentWithExpression(
              expect.any(String),
              '300'
            );
          }).toThrow(
            'Body contains zero arguments with the expected identifier.'
          );
        });
      });
    });
  });

  describe('negative', () => {
    describe('when body contains zero arguments with the given identifier', () => {
      it('passes', () => {
        const body = makeTFBlockBody([standardArgument]);

        expect(() => {
          expect<TFBlockBody>(body).not.toContainTFArgumentWithExpression(
            'ttl',
            '300'
          );
        }).not.toThrow();
      });
    });

    describe('when body contains any argument with the given identifier', () => {
      it('fails', () => {
        const body = makeTFBlockBody([expectedArgument, expectedArgument]);

        expect(() => {
          expect<TFBlockBody>(body).not.toContainTFArgumentWithExpression(
            'ttl',
            '300'
            // expect.anything()
          );
        }).toThrow('Body contains two arguments with the expected identifier.');
      });
    });
  });

  describe('when the expected is not a TFBlockBody', () => {
    it('fails', () => {
      const body: TFBlockBodyBody = [expectedArgument];

      expect(() => {
        expect<TFBlockBodyBody>(body).toContainTFArgumentWithExpression(
          'ttl',
          '300'
        );
      }).toThrow("Received isn't a TFBlockBody");
    });
  });
});
