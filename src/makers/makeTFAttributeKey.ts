import { makeTFIdentifier, makeTFLabel } from '@src/makers';
import { TFAttributeKey } from '@src/types';

export const makeTFAttributeKey = <TKey extends string = string>(
  key: TKey,
  surroundingText?: Partial<TFAttributeKey['surroundingText']>
): TFAttributeKey<TKey> => {
  if (['"', "'"].includes(key[0])) {
    return makeTFLabel(key, surroundingText);
  }

  return makeTFIdentifier(key, surroundingText);
};
