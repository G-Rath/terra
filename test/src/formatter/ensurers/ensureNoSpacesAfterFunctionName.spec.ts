import { ensureNoSpacesAfterFunctionName } from '@src/formatter';
import { makeFormatter } from '@test/helpers';
import dedent from 'dedent';

describe('ensureNoSpaceAfterFunctionName', () => {
  describe('when there are no blocks', () => {
    it('does nothing', () => {
      expect(ensureNoSpacesAfterFunctionName([])).toStrictEqual([]);
    });
  });

  it('ensures that there are no spaces after the function name', () => {
    expect(
      makeFormatter(ensureNoSpacesAfterFunctionName)(
        'locals { myValue = fn () }'
      )
    ).toStrictEqual('locals { myValue = fn() }');
  });

  it('ensures that there are no newlines after the function name', () => {
    expect(
      makeFormatter(ensureNoSpacesAfterFunctionName)(`
        locals {
          myValue = fn
            ()
        }
      `)
    ).toStrictEqual(dedent`
      locals {
        myValue = fn()
      }
    `);
  });

  it('does not the contents of comments', () => {
    expect(
      makeFormatter(ensureNoSpacesAfterFunctionName)(`
        locals {
          myValue = fn /*
            hello
            world
          */ ()
        }
      `)
    ).toStrictEqual(dedent`
      locals {
        myValue = fn/*
          hello
          world
        */()
      }
    `);
  });

  it('does not cause invalid single line comments', () => {
    expect(
      makeFormatter(ensureNoSpacesAfterFunctionName)(`
        locals {
          myValue = fn // hello world
            ()
        }
      `)
    ).toStrictEqual(dedent`
      locals {
        myValue = fn// hello world
      ()
      }
    `);
  });
});
