import startCase from 'lodash.startcase';

/**
 * Formats a monetary value in the given currency in the current
 * user's locale format.
 *
 * Currently only supports the GB locale.
 */
export function formatValue(value: number, currency: string) {
  if (!currency) return '';
  return new Intl.NumberFormat('gb-GB', {style: 'currency', currency}).format(
    value
  );
}

/** Converts the given string to Title Case */
export function titleCase(str: string): string {
  return startCase(str.toLowerCase());
}
