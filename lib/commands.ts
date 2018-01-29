import * as Commander from 'commander'

export function load(cli: Commander.Command, packageInfo: Object, cwd: string): Commander.Command {
  console.log(cwd)
  cli.version(packageInfo['version'], '-v, --version').description(packageInfo['description'])
  return cli
}
