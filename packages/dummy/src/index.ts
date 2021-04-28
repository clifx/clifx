import { Command, Parameter } from '@clifx/core';

const git = Command('git')
  .info('git example')
  .subcommands(['log'])
  .parameter(
    'verbose',
    Parameter<boolean>()
      .info('prints verbose output')
      .long('verbose')
      .short('v')
      .multiple()
      .create()
  )
  .parameter(
    'bare',
    Parameter<boolean>()
      .info('treat the repository as a bare repository')
      .long('bare')
      .create()
  )
  .parameter(
    'git-dir',
    Parameter()
      .info('set the path to the repository')
      .long('git-dir')
      .defaultValue('.')
      .create()
  );

git.run((result) => {
  console.log('git', result.dump());
});

export default git.create();
