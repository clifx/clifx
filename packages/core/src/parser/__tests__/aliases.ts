import { parse } from '../index';
import { Parameter } from '../../parameter';

describe('aliases', () => {
  const subcommands: string[] = [];

  test('longAliases', () => {
    const args = ['--boolean'];
    const bool = Parameter().long('bool').longAliases(['boolean']).create();
    const result = parse(args, { parameters: { bool }, subcommands });
    expect(result.count('bool')).toBe(1);
    expect(result.value('bool')).toBe(true);
  });

  test('shortAliases', () => {
    const args = ['-y'];
    const bool = Parameter().short('b').shortAliases(['y']).create();
    const result = parse(args, { parameters: { bool }, subcommands });
    expect(result.count('bool')).toBe(1);
    expect(result.value('bool')).toBe(true);
  });
});
