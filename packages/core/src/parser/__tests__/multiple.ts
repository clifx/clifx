import { Parameter } from '../../parameter';
import { parse } from '../index';

describe('multiple', () => {
  const subcommands: string[] = [];

  test.each([
    ['--bool --bool', 2, true],
    ['--bool -b', 2, true],
    ['--bool -bb -b', 4, true],
  ])('"%s"', (input, count, value) => {
    const args = input.split(' ');
    const bool = Parameter().long('bool').short('b').multiple().create();
    const result = parse(args, { parameters: { bool }, subcommands });
    expect(result.count('bool')).toBe(count);
    expect(result.value('bool')).toBe(value);
  });
});
