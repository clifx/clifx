import { parse } from '../index';
import { Parameter } from '../../parameter';

describe('parameter:positional', () => {
  const subcommands: string[] = [];

  describe('single', () => {
    test('with defaultValue', () => {
      const args = ''.split(' ');
      const arg1 = Parameter().defaultValue('defval1').create();
      const result = parse(args, { parameters: { arg1 }, subcommands });
      expect(result.value('arg1')).toBe('defval1');
    });

    test('without defaultValue', () => {
      const args = 'val1'.split(' ');
      const arg1 = Parameter().create();
      const result = parse(args, { parameters: { arg1 }, subcommands });
      expect(result.value('arg1')).toBe('val1');
    });
  });

  describe('multi', () => {
    describe('with defaultValue', () => {
      test.each([
        ['val1 val2', 'val1', 'val2'],
        ['val1', 'val1', 'defval2'],
        ['', 'defval1', 'defval2'],
      ])('"%s"', (input, v1, v2) => {
        const args = input.split(' ');
        const arg1 = Parameter().defaultValue('defval1').create();
        const arg2 = Parameter().defaultValue('defval2').create();
        const result = parse(args, {
          parameters: { arg1, arg2 },
          subcommands,
        });
        expect(result.value('arg1')).toBe(v1);
        expect(result.value('arg2')).toBe(v2);
      });

      describe('with position', () => {
        test.each([
          ['val1 val2', 'val1', 'val2'],
          ['val1', 'val1', 'defval2'],
          ['', 'defval1', 'defval2'],
        ])('"%s"', (input, v1, v2) => {
          const args = input.split(' ');
          const arg1 = Parameter().position(1).defaultValue('defval1').create();
          const arg2 = Parameter().position(2).defaultValue('defval2').create();
          const result = parse(args, {
            parameters: { arg2, arg1 },
            subcommands,
          });
          expect(result.value('arg1')).toBe(v1);
          expect(result.value('arg2')).toBe(v2);
        });
      });
    });
  });
});
