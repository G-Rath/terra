import * as parser from '@src/parser';
import { StringCursor, parseTFAttribute } from '@src/parser';
import { TFNodeType } from '@src/types';

describe('parseTFAttribute', () => {
  it('collects leading inner text', () => {
    const { leadingInnerText } = parseTFAttribute(
      new StringCursor('name = "my-name"')
    ).surroundingText;

    expect(leadingInnerText).toBe(' ');
  });

  it('collects leading inner comments', () => {
    const { leadingInnerText } = parseTFAttribute(
      new StringCursor('name /* hello world */ = "my-name"')
    ).surroundingText;

    expect(leadingInnerText).toBe(' /* hello world */ ');
  });

  describe('when the key is quoted', () => {
    it('uses TFLabel for the key', () => {
      const { key } = parseTFAttribute(new StringCursor('"key" = value /**/'));

      expect(key.type).toBe(TFNodeType.Label);
    });
  });

  describe('when the key is not quoted', () => {
    it('uses TFIdentifier for the key', () => {
      const { key } = parseTFAttribute(new StringCursor('key = value /**/'));

      expect(key.type).toBe(TFNodeType.Identifier);
    });
  });
  it('uses parseTFIdentifier', () => {
    const parseTFIdentifierSpy = jest.spyOn(parser, 'parseTFIdentifier');

    parseTFAttribute(new StringCursor('name /* hello world */= "my-name"'));

    expect(parseTFIdentifierSpy).toHaveBeenCalledWith(expect.any(StringCursor));
  });

  it('uses parseTFExpression', () => {
    const parseTFExpressionSpy = jest.spyOn(parser, 'parseTFExpression');

    parseTFAttribute(new StringCursor('name /* hello world */= "my-name"'));

    expect(parseTFExpressionSpy).toHaveBeenCalledWith(expect.any(StringCursor));
  });
});
