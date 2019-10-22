/*
  minor proposal: third optional "type" value
    -> can be used to provide information about if something is an map, list
    -> function, etc

    i.e:
      ["records", [], "a"] vs ["records", "[]"]

    This will be a useful extension to the library, as it'll let you do functions
    otherwise there isn't a way to properly denote them within the bounds of the
    the current types.

    This would also add ease-of-usage syntax for things like specifying empty
    array assignments.
*/

// todo: these will have to be changed to implement above in order to support actual map assignment values
//    i.e myValue = { } vs myValue { } - alternatively could just use optional `=` as third array value
type PrimitiveValue = string | number | boolean | null;
type BlockValue = Array<PrimitiveProperty | null>;
type ListValue = Array<PrimitiveValue | null>;
type MapValue = Array<PrimitiveProperty | null>;

/**
 * A tuple representing a Terraform property, formed of the property name, and it's value.
 *
 * The first element is the property name.
 * The second element is the property value.
 *
 * If the property value is a literal, then it's an assigned property.
 * Otherwise, if it's itself a `Property`, it's a block property.
 */
type PrimitiveProperty = [string, PrimitiveValue];
type BlockProperty = [string, BlockValue];
type ListProperty = [string, ListValue];
type MapProperty = [string, MapValue];

export type Property = PrimitiveProperty | ListProperty | MapProperty;
export type PropertyOrNull = Property | null;

/**
 * Checks if the give `value` is a `ListValue`
 *
 * @param value
 *
 * @return {boolean}
 */
const isListValue = (value: ListValue | MapValue): value is ListValue =>
  value.every((v: unknown) => v === null || !Array.isArray(v));

/**
 * Checks if the give `value` is a `MapValue`
 *
 * @param value
 *
 * @return {boolean}
 */
const isMapValue = (value: ListValue | MapValue): value is MapValue =>
  value.every((v: unknown) => v === null || Array.isArray(v));

/**
 * Stringifies the given `Property` tuple.
 *
 * @param {Property} property
 *
 * @return {string}
 */
export const stringifyProperty = (property: PropertyOrNull): string => {
  if (property === null) {
    return '';
  }

  const [name, value] = property;

  if (!Array.isArray(value)) {
    return `${name} = ${value}`;
  }

  /*
    empty arrays are considered blocks: '{}'
    empty lists are done using string format: '[]'
   */

  if (value.length === 0) {
    return `${name} {}`;
  }

  if (isListValue(value)) {
    return [
      `${name} = [`, //
      ...value.map(s => `  ${s},`.trimRight()),
      ']'
    ].join('\n');
  }

  if (isMapValue(value)) {
    return [
      `${name} {`,
      ...value
        .map(v => stringifyProperty(v))
        .map(s => `  ${s || ''}`.trimRight()),
      '}'
    ].join('\n');
  }

  throw Error('structural violation');
};
