import { parse } from '../index';
import { Parameter } from '../../parameter';

describe('stacking', () => {
  const subcommands: string[] = [];

  describe('parameter:flag', () => {
    describe('stacked multi', () => {
      test.each([
        ['-bc', true, true],
        ['-c', undefined, true],
      ])('"%s"', (input, vB, vC) => {
        const args = input.split(' ');
        const bool = Parameter().short('b').create();
        const cool = Parameter().short('c').create();
        const result = parse(args, {
          parameters: { bool, cool },
          subcommands,
        });
        expect(result.value('bool')).toBe(vB);
        expect(result.value('cool')).toBe(vC);
      });
    });
  });

  describe('parameter:{flag,option}', () => {
    describe('stacked mixed', () => {
      test.each([
        ['-boxyz', true, 'xyz'],
        ['-bo xyz', true, 'xyz'],
        ['-bo=xyz', true, 'xyz'],
      ])('"%s"', (input, vB, vO) => {
        const args = input.split(' ');
        const b = Parameter().short('b').create();
        const o = Parameter().short('o').takesValue().create();
        const result = parse(args, { parameters: { b, o }, subcommands });
        expect(result.value('b')).toBe(vB);
        expect(result.value('o')).toBe(vO);
      });
    });
  });
});
