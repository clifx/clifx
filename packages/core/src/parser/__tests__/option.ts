import { Parameter } from '../../parameter';
import { parse } from '../index';

describe('parameter:option', () => {
  const subcommands: string[] = [];

  describe('long parameter', () => {
    describe('single', () => {
      test.each([
        ['--opt val', 'val'],
        ['--opt=val', 'val'],
      ])('"%s"', (input, vO) => {
        const args = input.split(' ');
        const opt = Parameter().long('opt').takesValue().create();
        const result = parse(args, { parameters: { opt }, subcommands });
        expect(result.value('opt')).toBe(vO);
      });
    });

    describe('multi', () => {
      test.each([
        ['--opt value --char=a', 'value', 'a'],
        ['--opt=value --char a', 'value', 'a'],
      ])('"%s"', (input, vO, vC) => {
        const args = input.split(' ');
        const char = Parameter().long('char').takesValue().create();
        const opt = Parameter().long('opt').takesValue().create();
        const result = parse(args, {
          parameters: { char, opt },
          subcommands,
        });
        expect(result.value('char')).toBe(vC);
        expect(result.value('opt')).toBe(vO);
      });
    });
  });

  describe('short parameter', () => {
    describe('non-stacked single', () => {
      test.each([
        ['-oxyz', 'xyz'],
        ['-o xyz', 'xyz'],
        ['-o=xyz', 'xyz'],
      ])('"%s"', (input, vO) => {
        const args = input.split(' ');
        const o = Parameter().short('o').takesValue().create();
        const result = parse(args, { parameters: { o }, subcommands });
        expect(result.value('o')).toBe(vO);
      });
    });

    describe('non-stacked multi', () => {
      test.each([
        ['-oxyz -p=abc', 'xyz', 'abc'],
        ['-o xyz -pabc', 'xyz', 'abc'],
        ['-o=xyz -p abc', 'xyz', 'abc'],
      ])('"%s"', (input, vO, vP) => {
        const args = input.split(' ');
        const o = Parameter().short('o').takesValue().create();
        const p = Parameter().short('p').takesValue().create();
        const result = parse(args, { parameters: { o, p }, subcommands });
        expect(result.value('o')).toBe(vO);
        expect(result.value('p')).toBe(vP);
      });
    });
  });
});
