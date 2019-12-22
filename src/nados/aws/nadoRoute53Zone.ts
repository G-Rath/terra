import {
  buildRoute53RecordResource,
  buildRoute53ZoneResource
} from '@src/builders';
import {
  collectRoute53RecordDetails,
  collectRoute53ZoneDetails
} from '@src/collectors';
import { TFBlocks } from '@src/types';

export const nadoRoute53Zone = async (
  zoneId: string,
  greedy: boolean
): Promise<TFBlocks> => {
  const blocks: TFBlocks = [];
  const zoneDetails = await collectRoute53ZoneDetails(zoneId);

  blocks.push(buildRoute53ZoneResource(zoneDetails));

  if (greedy) {
    const recordDetails = await collectRoute53RecordDetails(zoneDetails);

    blocks.push(...recordDetails.map(buildRoute53RecordResource));
  }

  return blocks;
};
