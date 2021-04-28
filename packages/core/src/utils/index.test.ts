import { pushAt } from './index';

describe('utils - pushAt', () => {
  test('add item to array in specific index', () => {
    const array = ['a', 'b', 'd'];

    pushAt(array, 2, 'c');

    expect(array).toStrictEqual(['a', 'b', 'c', 'd']);
  });
});
