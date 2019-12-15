import {
  makeTFArgument,
  makeTFBlockBody,
  makeTFStringArgument
} from '@src/makers';
import { TFBlockBody, TFBlockBodyBody } from '@src/types';

import './toContainTFArgument';

describe('toContainTFArgument', () => {
  const standardArgument = makeTFStringArgument('name', 'example.com');
  const expectedArgument = makeTFArgument('ttl', '300');

  describe('positive', () => {
    describe('when body contains no arguments with the given identifier', () => {
      it('fails', () => {
        const body = makeTFBlockBody([standardArgument]);

        expect(() => {
          expect<TFBlockBody>(body).toContainTFArgument('ttl');
        }).toThrow(
          'Body contains zero arguments with the expected identifier.'
        );
      });
    });

    describe('when body contains one argument with the given identifier', () => {
      it('passes', () => {
        const body = makeTFBlockBody([expectedArgument]);

        expect(() => {
          expect<TFBlockBody>(body).toContainTFArgument('ttl');
        }).not.toThrow();
      });
    });

    describe('when body contains multiple arguments with the given identifier', () => {
      it('fails', () => {
        const body = makeTFBlockBody([expectedArgument, expectedArgument]);

        expect(() => {
          expect<TFBlockBody>(body).toContainTFArgument('ttl');
        }).toThrow('Body contains two arguments with the expected identifier.');
      });
    });

    describe('when using expect.any for the identifier', () => {
      describe('when the body has only one argument', () => {
        it('passes', () => {
          const body = makeTFBlockBody([expectedArgument, expectedArgument]);

          expect(() => {
            expect<TFBlockBody>(body).toContainTFArgument(expect.any(String));
          }).not.toThrow();
        });
      });

      describe('when the body has more than one argument', () => {
        it('passes', () => {
          const body = makeTFBlockBody([expectedArgument, expectedArgument]);

          expect(() => {
            expect<TFBlockBody>(body).toContainTFArgument(expect.any(String));
          }).not.toThrow();
        });
      });

      describe('when the body has no arguments', () => {
        it('fails', () => {
          const body = makeTFBlockBody([]);

          expect(() => {
            expect<TFBlockBody>(body).toContainTFArgument(expect.any(String));
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
          expect<TFBlockBody>(body).not.toContainTFArgument('ttl');
        }).not.toThrow();
      });
    });

    describe('when body contains any argument with the given identifier', () => {
      it('fails', () => {
        const body = makeTFBlockBody([expectedArgument, expectedArgument]);

        expect(() => {
          expect<TFBlockBody>(body).not.toContainTFArgument('ttl');
        }).toThrow('Body contains two arguments with the expected identifier.');
      });
    });
  });

  describe('when the expected is not a TFBlockBody', () => {
    it('fails', () => {
      const body: TFBlockBodyBody = [expectedArgument];

      expect(() => {
        expect<TFBlockBodyBody>(body).toContainTFArgument('ttl');
      }).toThrow("Received isn't a TFBlockBody");
    });
  });
});
