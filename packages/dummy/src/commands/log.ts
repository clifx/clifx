import { Command, Parameter } from '@clifx/core';

const log = Command('git')
  .info('git example')
  .subcommands(['log'])
  .parameter('follow', Parameter<boolean>().long('follow').create());

log.run((result) => {
  console.log('log', result.dump());
});

export default log.create();
