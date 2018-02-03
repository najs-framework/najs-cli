export interface IOptionDescriptor<T extends any> {
    flags?: string;
    description?: string;
    parser?: (arg1: any, arg2: any) => T;
    regex?: RegExp;
    defaultValue?: T;
}
export declare type Option<T extends Object> = {
    [K in keyof T]: IOptionDescriptor<T[K]> | string;
};
export interface ICommand<Options extends Object = {}> {
    command: string;
    description: string;
    optionsSignature: Option<Options>;
    handle(this: Partial<Options>, ...args: any[]): void;
}
