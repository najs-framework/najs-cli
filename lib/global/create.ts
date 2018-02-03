import * as Commander from 'commander'

export function create(cli: Commander.Command) {
  cli
    .command('create')
    .description('Create new najs application')
    .action(() => {})
}
