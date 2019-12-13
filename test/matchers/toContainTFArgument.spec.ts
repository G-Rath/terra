import { makeTFArgument, makeTFStringArgument } from '@src/makers';
import { TFBlockBodyBody } from '@src/types';

import './toContainTFArgument';

describe('toContainTFArgument', () => {
  const standardArgument = makeTFStringArgument('name', 'example.com');
  const expectedArgument = makeTFArgument('ttl', 300);

  describe('positive', () => {
    describe('when body contains no arguments with the given identifier', () => {
      it('fails', () => {
        const body = [standardArgument];

        expect(() => {
          expect<TFBlockBodyBody>(body).toContainTFArgument('ttl');
        }).toThrow(
          'Body contains zero arguments with the expected identifier.'
        );
      });
    });

    describe('when body contains one argument with the given identifier', () => {
      it('passes', () => {
        const body = [expectedArgument];

        expect(() => {
          expect<TFBlockBodyBody>(body).toContainTFArgument('ttl');
        }).not.toThrow();
      });
    });

    describe('when body contains multiple arguments with the given identifier', () => {
      it('fails', () => {
        const body = [expectedArgument, expectedArgument];

        expect(() => {
          expect<TFBlockBodyBody>(body).toContainTFArgument('ttl');
        }).toThrow('Body contains two arguments with the expected identifier.');
      });
    });

    describe('when using expect.any for the identifier', () => {
      describe('when the body has only one argument', () => {
        it('passes', () => {
          const body = [expectedArgument, expectedArgument];

          expect(() => {
            expect<TFBlockBodyBody>(body).toContainTFArgument(
              expect.any(String)
            );
          }).not.toThrow();
        });
      });

      describe('when the body has more than one argument', () => {
        it('passes', () => {
          const body = [expectedArgument, expectedArgument];

          expect(() => {
            expect<TFBlockBodyBody>(body).toContainTFArgument(
              expect.any(String)
            );
          }).not.toThrow();
        });
      });

      describe('when the body has no arguments', () => {
        it('fails', () => {
          const body: TFBlockBodyBody = [];

          expect(() => {
            expect<TFBlockBodyBody>(body).toContainTFArgument(
              expect.any(String)
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
        const body = [standardArgument];

        expect(() => {
          expect<TFBlockBodyBody>(body).not.toContainTFArgument('ttl');
        }).not.toThrow();
      });
    });

    describe('when body contains any argument with the given identifier', () => {
      it('fails', () => {
        const body = [expectedArgument, expectedArgument];

        expect(() => {
          expect<TFBlockBodyBody>(body).not.toContainTFArgument('ttl');
        }).toThrow('Body contains two arguments with the expected identifier.');
      });
    });
  });
});
