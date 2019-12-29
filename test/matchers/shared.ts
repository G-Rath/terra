import { TFBlock, TFBlockBody, TFNodeType } from '@src/types';
import { AsymmetricMatcher } from 'expect/build/asymmetricMatchers';

export const isAsymmetricMatcher = (
  v: unknown
): v is AsymmetricMatcher<unknown> =>
  typeof v === 'object' && v !== null && '$$typeof' in v;

const hasProperty = <TProperty extends string>(
  subject: object,
  property: TProperty
): subject is { [K in TProperty]: unknown } => property in subject;

const isObjectWithTypeProperty = (obj: unknown): obj is { type: string } =>
  typeof obj === 'object' && obj !== null && hasProperty(obj, 'type');

export const isTFBlock = <TIdentifier extends string = string>(
  body: TFBlock<TIdentifier> | unknown
): body is TFBlock<TIdentifier> =>
  isObjectWithTypeProperty(body) && body.type === TFNodeType.Block;

export const isTFBlockBody = <TIdentifier extends string = string>(
  body: TFBlockBody<TIdentifier> | unknown
): body is TFBlockBody<TIdentifier> =>
  isObjectWithTypeProperty(body) && body.type === TFNodeType.Body;

const explainWhyArgIsNotTFNodeType = (
  nodeType: TFNodeType,
  value: unknown
): unknown => {
  if (typeof value !== 'object') {
    return typeof value;
  }

  if (Array.isArray(value)) {
    return 'An array';
  }

  if (value === null || !hasProperty(value, 'type')) {
    return value;
  }

  /* istanbul ignore if */
  if (value.type === TFNodeType) {
    throw new Error(`Given argument *should* be a ${nodeType}`);
  }

  return value.type;
};

export const failMatcherDueToReason = (
  matcher: jest.MatcherUtils,
  matcherName: string,
  bodyMessage: string,
  expectedMessage: unknown,
  receivedMessage: unknown
) => ({
  pass: matcher.isNot,
  message: () => {
    const { utils } = matcher;

    const matcherHint = utils.matcherHint(matcherName);

    const labelExpected = 'Expected';
    const labelReceived = 'Received';
    const printLabel = utils.getLabelPrinter(labelExpected, labelReceived);

    return [
      matcherHint,
      '',
      bodyMessage,
      '',
      `${printLabel(labelExpected)}${utils.printExpected(expectedMessage)}`,
      `${printLabel(labelReceived)}${utils.printReceived(receivedMessage)}`
    ].join('\n');
  }
});

export const failMatcherDueToNotTFNode = (
  matcher: jest.MatcherUtils,
  matcherName: string,
  received: unknown,
  nodeType: TFNodeType
) =>
  failMatcherDueToReason(
    matcher,
    matcherName,
    `Received isn't a ${nodeType}.`,
    nodeType,
    explainWhyArgIsNotTFNodeType(nodeType, received)
  );
