import * as Path from 'path'
import * as FileSystem from 'fs'
import * as Commander from 'commander'
import { isObject } from 'lodash'
import { CodeTemplate } from '../private/CodeTemplate'
import { ChildProcessHelper } from '../private/ChildProcessHelper'
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
    this.createDirectoryStructure(this.getDirectoryStructure(), this.path())
    await new CodeTemplate('package.json')
      .with('name', this.name)
      .with('version', this.version)
      .writeToPath(this.path('package.json'))
    await this.createFilesInCWD()
    await this.installPackage()
    await this.createAutoload()
  }

  assertAppNameDoesNotExistsAndMakeDirectory() {
    const path: string = Path.join(this.cwd, this.name)
    if (FileSystem.existsSync(path)) {
      throw new Error('Directory ' + path + ' is exists, could not create application')
    }
    FileSystem.mkdirSync(path)
  }

  getDirectoryStructure() {
    return {
      '.vscode': true,
      app: {
        Console: true,
        Events: true,
        Http: {
          Controllers: true,
          Middleware: true
        },
        Jobs: true,
        Listeners: true,
        Mail: true,
        Models: true,
        Notifications: true,
        Policies: true,
        Providers: true,
        Rules: true,
        storage: {
          logs: true
        }
      },
      config: true,
      cypress: true,
      public: true,
      resources: {
        view: {
          layout: true
        }
      },
      routes: true,
      test: true
    }
  }

  createDirectoryStructure(structure: Object, base: string) {
    for (const name in structure) {
      if (structure[name] === false) {
        continue
      }

      const path = Path.join(base, name)
      FileSystem.mkdirSync(path)

      if (isObject(structure[name])) {
        this.createDirectoryStructure(structure[name], path)
      }
    }
  }

  async installPackage() {
    const cmd: string = ChildProcessHelper.hasYarn() ? 'yarn install' : 'npm install'
    await ChildProcessHelper.exec(`cd ${this.name} && ${cmd}`)
  }

  async createAutoload() {
    await ChildProcessHelper.exec(`cd ${this.name} && najs-cli autoload`)
  }

  async createFilesInCWD() {
    await new CodeTemplate('.gitignore').writeToPath(this.path('.gitignore'))
    await new CodeTemplate('autoload.json').writeToPath(this.path('autoload.json'))
    await new CodeTemplate('index.ts').writeToPath(this.path('index.ts'))
    await new CodeTemplate('tslint.json').writeToPath(this.path('tslint.json'))
    await new CodeTemplate('tsconfig.json').writeToPath(this.path('tsconfig.json'))
    await new CodeTemplate('.vscode', 'extensions.json').writeToPath(this.path('.vscode', 'extensions.json'))
    await new CodeTemplate('.vscode', 'settings.json').writeToPath(this.path('.vscode', 'settings.json'))
    await new CodeTemplate('config', 'default.js').writeToPath(this.path('config', 'default.js'))
  }
}
