import { join as joinPath, resolve as resolvePath } from 'path';
import { Command } from '../command/types';
import { parse } from '../parser';
import { dynamicImport } from '../utils/dynamic-import';

export async function run(
  argv = process.argv.slice(2),
  config: { rootPath?: string; parentReult?: any } = {}
): Promise<void> {
  const root = config.rootPath ?? resolvePath(require.main!.path, '..', 'src');

  const cmd = await dynamicImport<Command>(root);

  const result = parse(argv, cmd, config.parentReult);

  if (result.subcommand) {
    return run(result.unparsedArgv, {
      rootPath: joinPath(root, 'commands', result.subcommand),
      parentReult: result,
    });
  }

  await cmd.run(result);
}
