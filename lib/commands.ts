import * as Commander from 'commander'

export function load(cli: Commander.Command, packageInfo: Object): Commander.Command {
  cli.version(packageInfo['version'], '-v, --version').description(packageInfo['description'])
  return cli
}
