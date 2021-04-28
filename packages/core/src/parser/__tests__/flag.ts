import { parse } from '../index';
import { Parameter } from '../../parameter';

describe('parameter:flag', () => {
  const subcommands: string[] = [];

  describe('long parameter', () => {
    describe('single', () => {
      test.each([
        ['--bool', true],
        ['', undefined],
      ])('"%s"', (input, vB) => {
        const args = input.split(' ');
        const bool = Parameter().long('bool').create();
        const result = parse(args, { parameters: { bool }, subcommands });
        expect(result.value('bool')).toBe(vB);
      });
    });

    describe('multi', () => {
      test.each([
        ['--bool --cool', true, true],
        ['--cool', undefined, true],
      ])('"%s"', (input, vB, vC) => {
        const args = input.split(' ');
        const bool = Parameter().long('bool').create();
        const cool = Parameter().long('cool').create();
        const result = parse(args, {
          parameters: { bool, cool },
          subcommands,
        });
        expect(result.value('bool')).toBe(vB);
        expect(result.value('cool')).toBe(vC);
      });
    });
  });

  describe('short parameter', () => {
    describe('non-stacked single', () => {
      test.each([
        ['-b', true],
        ['', undefined],
      ])('"%s"', (input, vB) => {
        const args = input.split(' ');
        const bool = Parameter().short('b').create();
        const result = parse(args, { parameters: { bool }, subcommands });
        expect(result.value('bool')).toBe(vB);
      });
    });

    describe('non-stacked multi', () => {
      test.each([
        ['-b -c', true, true],
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
});
