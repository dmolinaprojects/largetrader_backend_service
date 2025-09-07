export const toKebabCase = (str: string): string =>
  str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

export const bigintReplacer = (key: string, value: bigint): string => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};
