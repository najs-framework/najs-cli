import * as Commander from 'commander'

export function list(cli: Commander.Command) {
  cli
    .command('list')
    .description('List all commands of application')
    .action(() => {})
}
