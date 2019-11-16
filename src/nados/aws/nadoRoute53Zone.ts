import {
  buildRoute53RecordResource,
  buildRoute53ZoneResource
} from '@src/builders';
import {
  collectRoute53RecordDetails,
  collectRoute53ZoneDetails
} from '@src/collectors';
import { TFFileAST } from '@src/types';

export const nadoRoute53Zone = async (
  zoneId: string,
  greedy: boolean
): Promise<TFFileAST> => {
  const ast: TFFileAST = [];
  const zoneDetails = await collectRoute53ZoneDetails(zoneId);

  ast.push(buildRoute53ZoneResource(zoneDetails));

  if (greedy) {
    const recordDetails = await collectRoute53RecordDetails(zoneDetails);

    ast.push(...recordDetails.map(buildRoute53RecordResource));
  }

  return ast;
};
