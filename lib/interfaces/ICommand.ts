export interface IOptionDescriptor<T extends any> {
  flags?: string
  description?: string
  parser?: (arg1: any, arg2: any) => T
  regex?: RegExp
  defaultValue?: T
}

export type Option<T extends Object> = { [K in keyof T]: IOptionDescriptor<T[K]> | string }

// const x: Option<{ coverage: number }> = {
//   coverage: {
//     flags: '-c, --coverage',
//     description: 'collect coverage',
//     defaultValue: 0
//   }
// }

export interface ICommand<Options extends Object = {}> {
  command: string
  description: string
  optionsSignature: Option<Options>

  handle(this: Partial<Options>, ...args: any[]): void
}
