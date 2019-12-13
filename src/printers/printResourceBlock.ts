import { printBlockBody } from '@src/printers';
import { TFResourceBlock } from '@src/types';

export const printResourceBlock = (resourceBlock: TFResourceBlock): string => {
  const {
    type, //
    resource,
    name,
    body
  } = resourceBlock;

  return [
    type, //
    `"${resource}"`,
    `"${name}"`,
    printBlockBody(body.body)
  ].join(' ');
};
