import * as FileSystem from 'fs'
import * as Path from 'path'
import * as Ejs from 'ejs'

export class CodeTemplate {
  protected templatePath: string
  protected template: string
  protected variables: Object

  constructor(template: string)
  constructor(...args: string[])
  constructor(...args: string[]) {
    this.template = args.length === 1 ? args[0] : Path.join(...args)
    this.templatePath = Path.resolve(__dirname, '..', '..', '..', 'templates', this.template + '.ejs')
    if (!FileSystem.existsSync(this.templatePath)) {
      throw new Error('Template ' + this.template + ' not found.')
    }
    this.variables = {}
  }

  with(name: string, value: any): this {
    this.variables[name] = value
    return this
  }

  async getTemplateContent(): Promise<string> {
    return <Promise<string>>new Promise((resolve, reject) => {
      FileSystem.readFile(this.templatePath, 'utf8', function(error, contents: string) {
        if (error) {
          return reject(error)
        }
        resolve(contents)
      })
    })
  }

  async getContent(): Promise<string> {
    const content = await this.getTemplateContent()
    return Ejs.render(content, this.variables)
  }

  async writeToPath(path: string, overrideIfExists: boolean = true) {
    if (FileSystem.existsSync(path)) {
      if (!overrideIfExists) {
        throw new Error('File ' + path + ' exists, could not override it.')
      }
      FileSystem.unlinkSync(path)
    }

    const stream = FileSystem.createWriteStream(path)
    return stream.once('open', async () => {
      stream.write(await this.getContent())
      stream.end()
    })
  }
}
