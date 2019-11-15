import {
  buildRoute53RecordResource,
  buildRoute53ZoneResource
} from '@src/builders';
import {
  collectRoute53RecordDetails,
  collectRoute53ZoneDetails
} from '@src/collectors';
import { TFRoot } from '@src/types';

export const nadoRoute53Zone = async (
  zoneId: string,
  greedy: boolean
): Promise<TFRoot> => {
  const root: TFRoot = [];
  const zoneDetails = await collectRoute53ZoneDetails(zoneId);

  root.push(buildRoute53ZoneResource(zoneDetails));

  if (greedy) {
    const recordDetails = await collectRoute53RecordDetails(zoneDetails);

    root.push(...recordDetails.map(buildRoute53RecordResource));
  }

  return root;
};
