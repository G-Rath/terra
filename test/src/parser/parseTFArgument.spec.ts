import * as parser from '@src/parser';
import { StringCursor, parseTFArgument } from '@src/parser';

describe('parseTFArgument', () => {
  it('collects leading inner text', () => {
    const { leadingInnerText } = parseTFArgument(
      new StringCursor('name = "my-name"')
    ).surroundingText;

    expect(leadingInnerText).toBe(' ');
  });

  it('collects leading inner comments', () => {
    const { leadingInnerText } = parseTFArgument(
      new StringCursor('name /* hello world */ = "my-name"')
    ).surroundingText;

    expect(leadingInnerText).toBe(' /* hello world */ ');
  });

  it('uses parseTFIdentifier', () => {
    const parseTFIdentifierSpy = jest.spyOn(parser, 'parseTFIdentifier');

    parseTFArgument(new StringCursor('name /* hello world */= "my-name"'));

    expect(parseTFIdentifierSpy).toHaveBeenCalledWith(expect.any(StringCursor));
  });

  it('uses parseTFExpression', () => {
    const parseTFExpressionSpy = jest.spyOn(parser, 'parseTFExpression');

    parseTFArgument(new StringCursor('name /* hello world */= "my-name"'));

    expect(parseTFExpressionSpy).toHaveBeenCalledWith(expect.any(StringCursor));
  });
});
