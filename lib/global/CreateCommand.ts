import * as Path from 'path'
import * as FileSystem from 'fs'
import * as Commander from 'commander'
import * as ChildProcess from 'child_process'
import * as Semver from 'semver'
import { CodeTemplate } from '../templates/CodeTemplate'
import { GlobalCommandBase } from './GlobalCommandBase'

export class CreateCommand extends GlobalCommandBase {
  name: string
  version: string

  register(): void {
    this.cli
      .command('create <app-name>')
      .description('Create new najs application')
      .option('-a, --app-version <version>', 'Version of your application', '0.0.1')
      .action(async (name: string, command: Commander.Command) => {
        this.name = name
        this.version = command['appVersion']
        await this.handle()
      })
  }

  path(...args: string[]): string {
    return Path.join(this.cwd, this.name, ...args)
  }

  async handle() {
    this.assertAppNameDoesNotExistsAndMakeDirectory()
    await new CodeTemplate('package.json')
      .with('name', this.name)
      .with('version', this.version)
      .writeToPath(this.path('package.json'))
    await this.createFilesInCWD()
    await this.installPackage()
  }

  protected async installPackage() {
    return new Promise(resolve => {
      const cmd: string = this.hasYarn() ? 'yarn install' : 'npm install'
      const installer: ChildProcess.ChildProcess = ChildProcess.exec(`cd ${this.name} && ${cmd}`, function() {})
      installer.unref()
      installer.stdout.on('data', function(data) {
        process.stdout.write(data)
      })
      installer.stderr.on('data', function(data) {
        process.stderr.write(data)
      })
      installer.on('close', function() {
        resolve()
      })
    })
  }

  protected hasYarn() {
    const version: any = ChildProcess.execSync('yarn --version')
      .toString()
      .trim()
    return Semver.valid(version) ? true : false
  }

  protected assertAppNameDoesNotExistsAndMakeDirectory() {
    const path: string = Path.join(this.cwd, this.name)
    if (FileSystem.existsSync(path)) {
      throw new Error('Directory ' + path + ' is exists, could not create application')
    }
    FileSystem.mkdirSync(path)
  }

  protected async createFilesInCWD() {
    await new CodeTemplate('.gitignore').writeToPath(this.path('.gitignore'))
    await new CodeTemplate('autoload.json').writeToPath(this.path('autoload.json'))
  }
}
