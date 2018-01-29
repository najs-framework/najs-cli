import * as cli from 'commander'

cli.version('0.0.1').description('Najs CLI')

cli
  .command('setup [env] [something-else]')
  .description('run setup commands for all envs')
  .option('-s, --setup_mode [mode]', 'Which setup mode to use')
  .action(function(this: any, env, something, options) {
    console.log(this)
    console.log(env, something, options['setup_mode'])
    const mode = options.setup_mode || 'normal'
    env = env || 'all'
    console.log('setup for %s env(s) with %s mode', env, mode)
  })

cli.parse(process.argv)
