import { Parameter } from '../parameter/types';
import { Command, CommandFactory } from './types';

export function Command(id: string): CommandFactory {
  const cmd: Command<{ [id: string]: Parameter }> = {
    id,
    parameters: {},
    subcommands: [],
    run: async () => {
      return;
    },
  };

  const factory: CommandFactory = {
    long(long) {
      cmd.long = long;
      return this;
    },
    short(short) {
      cmd.short = short;
      return this;
    },
    info(info) {
      cmd.info = info;
      return this;
    },
    usage(usage) {
      cmd.usage = usage;
      return this;
    },
    parameter(id, parameter) {
      if (cmd.parameters[id]) {
        throw new Error();
      }

      cmd.parameters[id] = parameter;
      return this as CommandFactory<{ [id in typeof id]: typeof parameter }>;
    },
    subcommands(names) {
      cmd.subcommands = Array.isArray(names) ? names : names();
      return this;
    },
    run(run) {
      cmd.run = run;
      return this;
    },
    create() {
      return cmd;
    },
  };

  return factory;
}
