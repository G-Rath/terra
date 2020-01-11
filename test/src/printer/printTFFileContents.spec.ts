import { printTFFileContents } from '@src/printer';
import * as printer from '@src/printer';

describe('printTFFileContents', () => {
  it('starts with the leadingOuterText', () => {
    expect(
      printTFFileContents({
        blocks: [],
        surroundingText: {
          leadingOuterText: '# This is the hosted zone for the zone that I own',
          trailingOuterText: ''
        }
      })
    ).toMatch(/^# This is the hosted zone for the zone that I own/u);
  });

  it('prints the body using printTFBlocks', () => {
    const printTFBlocksSpy = jest.spyOn(printer, 'printTFBlocks');

    printTFFileContents({
      blocks: [],
      surroundingText: {
        leadingOuterText: '',
        trailingOuterText: ''
      }
    });

    expect(printTFBlocksSpy).toHaveBeenCalledWith([]);
  });

  it('ends with the trailingOuterText', () => {
    expect(
      printTFFileContents({
        blocks: [],
        surroundingText: {
          leadingOuterText: '',
          trailingOuterText: '\n'
        }
      })
    ).toMatch(/\n$/u);
  });
});
