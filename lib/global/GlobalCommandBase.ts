import * as Commander from 'commander'

export abstract class GlobalCommandBase {
  cli: Commander.Command
  cwd: string

  constructor(cli: Commander.Command, cwd: string) {
    this.cli = cli
    this.cwd = cwd
    this.register()
  }

  abstract register(): void
}
