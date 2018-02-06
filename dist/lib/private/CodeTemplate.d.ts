/// <reference types="node" />
import * as FileSystem from 'fs';
export declare class CodeTemplate {
    protected templatePath: string;
    protected template: string;
    protected variables: Object;
    constructor(template: string);
    constructor(...args: string[]);
    with(name: string, value: any): this;
    getTemplateContent(): Promise<string>;
    getContent(): Promise<string>;
    writeToPath(path: string, overrideIfExists?: boolean): Promise<FileSystem.WriteStream>;
}
