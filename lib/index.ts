import * as Commander from 'commander'
import { is_najs_application } from './private/is_najs_application'
import { list as list_command } from './global/list'
import { create as create_command } from './global/create'
import { AutoloadCommand } from './global/AutoloadCommand'

export function load(cli: Commander.Command, packageInfo: Object, cwd: string): Commander.Command {
  cli.version(packageInfo['version'], '-v, --version').description(packageInfo['description'])
  cli.usage('[option]')
  if (is_najs_application(cwd)) {
    list_command(cli)
    new AutoloadCommand(cli, cwd)
  } else {
    create_command(cli)
  }
  return cli
}
