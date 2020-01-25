import { Ensurer, format } from '@src/formatter';
import * as ensurers from '@src/formatter/ensurers';
import { makeTFResourceBlock } from '@src/makers';
import { TFFileContents } from '@src/types';
import { AwsResourceType } from '@src/utils';
import { mocked } from 'ts-jest/utils';

jest.mock('@src/formatter/ensurers');

const mockedEnsurers = mocked(ensurers);

describe('format', () => {
  beforeEach(() => {
    Object.values(mockedEnsurers)
      .filter((v): v is jest.MockedFunction<Ensurer> => typeof v === 'function')
      .forEach(mockedEnsurer => mockedEnsurer.mockReturnValue([]));
  });

  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(
        format({
          blocks: [],
          surroundingText: {
            leadingOuterText: '',
            trailingOuterText: ''
          }
        })
      ).toStrictEqual<TFFileContents>({
        blocks: [],
        surroundingText: {
          leadingOuterText: '',
          trailingOuterText: ''
        }
      });
    });
  });

  describe('when there is at least one block', () => {
    it('ensures the file ends with a new line', () => {
      expect(
        format({
          blocks: [
            makeTFResourceBlock(
              AwsResourceType.AWS_ROUTE53_ZONE, //
              'my_zone',
              []
            )
          ],
          surroundingText: {
            leadingOuterText: '',
            trailingOuterText: ''
          }
        })
      ).toStrictEqual<TFFileContents>({
        blocks: expect.any(Array),
        surroundingText: {
          leadingOuterText: '',
          trailingOuterText: '\n'
        }
      });
    });

    describe('when the file already ends with a newline', () => {
      it('does not add another', () => {
        expect(
          format({
            blocks: [
              makeTFResourceBlock(
                AwsResourceType.AWS_ROUTE53_ZONE,
                'my_zone',
                []
              )
            ],
            surroundingText: {
              leadingOuterText: '',
              trailingOuterText: '\n'
            }
          })
        ).toStrictEqual<TFFileContents>({
          blocks: expect.any(Array),
          surroundingText: {
            leadingOuterText: '',
            trailingOuterText: '\n'
          }
        });
      });
    });

    it('calls the ensurers', () => {
      format({
        blocks: [
          makeTFResourceBlock(AwsResourceType.AWS_ROUTE53_ZONE, 'my_zone', [])
        ],
        surroundingText: {
          leadingOuterText: '',
          trailingOuterText: ''
        }
      });

      Object.values(mockedEnsurers)
        .filter(v => typeof v === 'function')
        .forEach(mockedEnsurer =>
          expect(mockedEnsurer).toHaveBeenCalledWith(expect.any(Array))
        );
      // mockedEnsurers
    });
  });
});
