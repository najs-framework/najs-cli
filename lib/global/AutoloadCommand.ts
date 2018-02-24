import * as Path from 'path'
import * as FileSystem from 'fs'
import * as Glob from 'glob'
import * as Async from 'async'
import { GlobalCommandBase } from './GlobalCommandBase'
import { CodeTemplate } from '../private/CodeTemplate'

export type AutoloadConfigItem = {
  included: string[] | Object
  excluded: string[] | Object
}

export type AutoloadConfig = {
  [key: string]: AutoloadConfigItem
}

export type GlobMatchedItem = {
  path: string
  pattern: string
  type: string
  options: Object
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
    for (const file in config) {
      await this.generateAutoloadFile(file, config[file])
    }
  }

  async generateAutoloadFile(fileName: string, config: AutoloadConfigItem) {
    const excluded: GlobMatchedItem[] = await this.matchFileByGlobPatterns(config.excluded, {}, false)
    const included: GlobMatchedItem[] = await this.matchFileByGlobPatterns(config.included, { register: false }, true)

    const result: GlobMatchedItem[] = included.filter(
      (item: GlobMatchedItem) =>
        excluded.findIndex(excludedItem => excludedItem.type === 'file' && excludedItem.path === item.path) === -1
    )
    const template = new CodeTemplate('autoload.ts')
    template.with('content', this.buildContentFromFileList(result))
    template.writeToPath(Path.join(this.cwd, fileName))
  }

  async matchFileByGlobPatterns(
    input: string[] | Object,
    defaultOptions: Object,
    includePattern: boolean
  ): Promise<GlobMatchedItem[]> {
    const isUsingInputAsAnObject = !Array.isArray(input)
    const patterns: string[] = isUsingInputAsAnObject ? Object.keys(input) : <string[]>input

    return <Promise<GlobMatchedItem[]>>new Promise((resolve: any, reject: any) => {
      // I have to use async here to maintain order of result matched by patterns
      Async.reduce<string, GlobMatchedItem[], any>(
        patterns,
        [],
        function(result: GlobMatchedItem[], pattern: string, next: any) {
          Glob(pattern, {}, function(error, files: string[]) {
            if (error) {
              throw error
            }
            if (includePattern) {
              result.push({
                path: pattern,
                pattern: pattern,
                type: 'pattern',
                options: Object.assign({}, isUsingInputAsAnObject ? input[pattern] : {})
              })
            }
            for (const file of files) {
              result.push({
                path: file,
                pattern: pattern,
                type: 'file',
                options: Object.assign({}, defaultOptions, isUsingInputAsAnObject ? input[pattern] : {})
              })
            }
            next(undefined, result)
          })
        },
        function(error: any, result: GlobMatchedItem[]) {
          if (error) {
            return reject(error)
          }
          resolve(
            result.filter(
              (item: GlobMatchedItem, index: number, self: GlobMatchedItem[]) =>
                index === self.findIndex((matched: GlobMatchedItem) => matched.path === item.path)
            )
          )
        }
      )
    })
  }

  buildContentFromFileList(items: GlobMatchedItem[]): string {
    const lines: string[] = []
    for (const item of items) {
      if (item.type === 'pattern') {
        this.buildContentFromGlobMatchItemTypePattern(lines, item)
        continue
      }

      this.buildContentFromGlobMatchItemTypeFile(lines, item)
    }
    return lines.join('\n')
  }

  buildContentFromGlobMatchItemTypePattern(lines: string[], item: GlobMatchedItem) {
    lines.push('')
    lines.push(`// ${item.pattern}`)
  }

  buildContentFromGlobMatchItemTypeFile(lines: string[], item: GlobMatchedItem) {
    const hasRegister = item.options && item.options['register']
    let importPath = './'
    if (item.path.endsWith('.ts')) {
      importPath += item.path.substr(0, item.path.length - 3)
    }

    if (!hasRegister) {
      lines.push(`import '${importPath}'`)
      return
    }

    const name = importPath
      .substr(2)
      .split('.')
      .join('_')
      .split(Path.sep)
      .join('_')
    lines.push(`import * as ${name} from '${importPath}'`)
    lines.push(`register_classes(${name})`)
  }
}
