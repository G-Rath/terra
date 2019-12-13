import { TFBlockBody, TFNodeType } from '@src/types';

const hasProperty = <TProperty extends string>(
  subject: object,
  property: TProperty
): subject is { [K in TProperty]: unknown } => property in subject;

export const isTFBlockBody = <TIdentifier extends string = string>(
  body: TFBlockBody<TIdentifier> | unknown
): body is TFBlockBody<TIdentifier> =>
  typeof body === 'object' &&
  body !== null &&
  hasProperty(body, 'type') &&
  body.type === TFNodeType.Body;

const explainWhyArgIsNotTFBlockBody = (
  body: unknown /* & not TFBlockBody */
): unknown => {
  if (typeof body !== 'object') {
    return typeof body;
  }

  if (body === null || !hasProperty(body, 'type')) {
    return body;
  }

  /* istanbul ignore if */
  if (body.type === TFNodeType.Body) {
    throw new Error('Given argument *should* be a TFBlockBody');
  }

  return body.type;
};

export const failMatcherDueToNotTFBlockBody = (
  matcher: jest.MatcherUtils,
  matcherName: string,
  received: unknown /* & not TFBlockBody */
) => ({
  pass: matcher.isNot,
  message: () => {
    const { utils } = matcher;

    const matcherHint = utils.matcherHint(matcherName);

    const labelExpected = 'Expected TFBlockBody';
    const labelReceived = 'Received';
    const printLabel = utils.getLabelPrinter(labelExpected, labelReceived);
    const reason = explainWhyArgIsNotTFBlockBody(received);

    return [
      matcherHint,
      '',
      "Received isn't a TFBlockBody.",
      '',
      `${printLabel(labelExpected)}${utils.printExpected('TFBlockBody')}`,
      `${printLabel(labelReceived)}${utils.printReceived(reason)}`
    ].join('\n');
  }
});
