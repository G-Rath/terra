/**
 * Normalises the given `name` from `Route53`, by removing trailing dots.
 *
 * If the `zone` is provided, then the name is trimmed relative to the zone.
 *
 * @param {string!} name
 * @param {string?} zone
 *
 * @return {string}
 */
export const normaliseRoute53Name = (name: string, zone?: string): string => {
  if (name.endsWith('.')) {
    return normaliseRoute53Name(name.slice(0, -1), zone);
  }

  if (zone) {
    if (zone.endsWith('.')) {
      return normaliseRoute53Name(name, normaliseRoute53Name(zone));
    }

    if (name.endsWith(zone)) {
      return normaliseRoute53Name(name.slice(0, -zone.length));
    }
  }

  return name;
};
