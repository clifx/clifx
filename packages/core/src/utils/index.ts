export const isDefined = <T>(value: T): value is Exclude<T, undefined> => {
  return typeof value !== 'undefined';
};

export const pushAt = <T extends unknown[]>(
  array: T,
  index: number,
  item: T[number]
): void => {
  array.splice(index, 0, item);
};
