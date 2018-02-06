import * as Path from 'path'
import * as FileSystem from 'fs'
import * as Glob from 'glob'
import * as Async from 'async'
import { GlobalCommandBase } from './GlobalCommandBase'
import { CodeTemplate } from '../private/CodeTemplate'

export type AutoloadConfig = {
  included: string[]
  excluded: string[]
}

export class AutoloadCommand extends GlobalCommandBase {
  register(): void {
    this.cli
      .command('autoload')
      .description('Create autoload file')
      .action(() => this.handle())
    this.cli
      .command('dumpautoload')
      .description('Create autoload file (alias of autoload)')
      .action(() => this.handle())
    this.cli
      .command('dump-autoload')
      .description('Create autoload file (alias of autoload)')
      .action(() => this.handle())
  }

  async handle() {
    const autoloadJsonPath = Path.join(this.cwd, 'autoload.json')
    const configTemplate = new CodeTemplate('autoload.json')

    let config: AutoloadConfig
    if (FileSystem.existsSync(autoloadJsonPath)) {
      config = require(autoloadJsonPath)
    } else {
      config = JSON.parse(await configTemplate.getTemplateContent())
      configTemplate.writeToPath(autoloadJsonPath)
    }
    return this.generateByConfig(config)
  }

  async generateByConfig(config: AutoloadConfig) {
    const excluded: string[] = await this.matchFileByGlobPatterns(config.excluded, false)
    const included: string[] = await this.matchFileByGlobPatterns(config.included, true)

    const result: string[] = included.filter(item => excluded.indexOf(item) === -1)
    const template = new CodeTemplate('autoload.ts')
    template.with('content', this.buildContentFromFileList(result))
    template.writeToPath(Path.join(this.cwd, 'autoload.ts'))
  }

  async matchFileByGlobPatterns(patterns: string[], includeComment: boolean): Promise<string[]> {
    return <Promise<string[]>>new Promise((resolve: any, reject: any) => {
      // I have to use async here to maintain order of result matched by patterns
      Async.reduce<string, string[], any>(
        patterns,
        [],
        function(result: string[], pattern: string, next: any) {
          Glob(pattern, {}, function(error, files: string[]) {
            if (error) {
              throw error
            }
            next(undefined, result.concat(includeComment ? ['// "' + pattern + '"'] : [], files))
          })
        },
        function(error: any, result: string[]) {
          if (error) {
            return reject(error)
          }
          resolve(Array.from(new Set(result)))
        }
      )
    })
  }

  buildContentFromFileList(files: string[]): string {
    const lines: string[] = []
    for (const file of files) {
      if (file.indexOf('//') === 0) {
        lines.push('')
        lines.push(file)
        continue
      }
      let importPath = './'
      if (file.endsWith('.ts')) {
        importPath += file.substr(0, file.length - 3)
      }
      lines.push(`import '${importPath}'`)
    }
    return lines.join('\n')
  }
}
