import { Command } from '../command/types';
import { Parameter } from '../parameter/types';
import { isDefined, pushAt } from '../utils';
import { Args } from './args';
import { Result, ResultFactory } from './result';

export function parse<
  ParameterMap extends { [id: string]: Parameter },
  ParentParameterMap extends ParameterMap = never
>(
  argv: string[],
  command: Pick<Command, 'parameters' | 'subcommands'>,
  parentdResult?: Result<ParentParameterMap>
): Result<ParameterMap> {
  const { parameters, subcommands } = command;

  const positionSet = new Set<number>();

  const longParams = new Map<string, { id: string } & Parameter>();
  const shortParams = new Map<string, { id: string } & Parameter>();
  const positionalParameters: Array<{ id: string } & Parameter> = [];

  const result = ResultFactory<ParameterMap>();

  for (const [id, parameter] of Object.entries(parameters)) {
    if (isDefined(parameter.long)) {
      if (longParams.has(parameter.long)) {
        throw new Error();
      }

      longParams.set(parameter.long, { id, ...parameter });

      if (isDefined(parameter.longAliases)) {
        for (const longAlias of parameter.longAliases) {
          if (longParams.has(longAlias)) {
            throw new Error();
          }

          longParams.set(longAlias, { id, ...parameter });
        }
      }
    }

    if (isDefined(parameter.short)) {
      if (shortParams.has(parameter.short)) {
        throw new Error();
      }

      shortParams.set(parameter.short, { id, ...parameter });

      if (isDefined(parameter.shortAliases)) {
        for (const shortAlias of parameter.shortAliases) {
          if (shortParams.has(shortAlias)) {
            throw new Error();
          }

          shortParams.set(shortAlias, { id, ...parameter });
        }
      }
    }

    if (!isDefined(parameter.long) && !isDefined(parameter.short)) {
      if (isDefined(parameter.position)) {
        if (positionSet.has(parameter.position)) {
          throw new Error();
        }

        positionSet.add(parameter.position);

        const index = parameter.position - 1;

        pushAt(positionalParameters, index, { id, ...parameter });
      } else {
        positionalParameters.push({ id, ...parameter });
      }
    }

    if (isDefined(parameter.defaultValue)) {
      result.setValue(id, parameter.defaultValue);
    }
  }

  const args = Args(argv);

  let arg = args.peek();

  while (arg) {
    args.consume();

    if (arg.startsWith(`--`)) {
      // long parameter
      const [name, ...rest] = arg.slice(2).split('=');

      const parameter = longParams.get(name);

      if (parameter) {
        const id = parameter.id;

        const count = result.getCount(id);

        if (!parameter.multiple && count > 0) {
          throw new Error();
        }

        result.incrementCount(id);

        if (parameter.takesValue) {
          // parameter:option

          let value: string | undefined;

          if (rest.length > 0) {
            value = rest.join('=');
          } else {
            const nextArg = args.peek();

            if (nextArg && !nextArg.startsWith('-')) {
              args.consume();

              value = nextArg;
            }
          }

          if (value) {
            if (parameter.valid) {
              if (!parameter.valid(value)) {
                throw new Error();
              }
            }
            if (parameter.parse) {
              result.setValue(id, parameter.parse(value));
            } else {
              result.setValue(id, value);
            }
          } else if (typeof parameter.defaultValue !== 'undefined') {
            result.setValue(id, parameter.defaultValue);
          } else {
            throw new Error();
          }
        } else {
          // parameter:flag

          result.setValue(id, true);
        }
      }
    } else if (arg.startsWith('-') && arg.length > 1) {
      // short parameter

      const [name, ...rest] = arg.slice(1).split('');

      const parameter = shortParams.get(name);

      if (parameter) {
        const id = parameter.id;

        const count = result.getCount(id);

        if (!parameter.multiple && count > 0) {
          throw new Error();
        }

        result.incrementCount(id);

        if (parameter.takesValue) {
          // parameter:option

          let value: string | undefined;

          if (rest.length > 0) {
            value = rest.join('').replace(/^=/, '');
          } else {
            const nextArg = args.peek();

            if (nextArg && !nextArg.startsWith('-')) {
              args.consume();

              value = nextArg;
            }
          }

          if (value) {
            if (parameter.valid) {
              if (!parameter.valid(value)) {
                throw new Error();
              }
            }

            if (parameter.parse) {
              result.setValue(id, parameter.parse(value));
            } else {
              result.setValue(id, value);
            }
          } else if (typeof parameter.defaultValue !== 'undefined') {
            result.setValue(id, parameter.defaultValue);
          } else {
            throw new Error();
          }
        } else {
          // parameter:flag

          result.setValue(id, true);

          if (rest.length > 0) {
            // stacked short parameter

            args.add(`-${rest.join('')}`);
          }
        }
      }
    } else {
      // positional parameter

      if (subcommands.includes(arg)) {
        result.setSubcommand(arg);
        result.setUnparsedArgv(args.drain());
        break;
      }

      if (positionalParameters.length > 0) {
        const parameter = positionalParameters[0];

        if (parameter) {
          const id = parameter.id;

          result.incrementCount(id);

          if (!parameter.multipleValue) {
            positionalParameters.shift();
          }

          const value = arg;

          if (parameter.valid) {
            if (!parameter.valid(value)) {
              throw new Error();
            }
          }

          if (parameter.parse) {
            result.setValue(id, parameter.parse(value));
          } else {
            result.setValue(id, value);
          }
        }
      }
    }

    arg = args.peek();
  }

  return result.create();
}
