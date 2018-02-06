import * as Commander from 'commander';
export declare type AutoloadConfig = {
    included: string[];
    excluded: string[];
};
export declare class AutoloadCommand {
    cli: Commander.Command;
    cwd: string;
    constructor(cli: Commander.Command, cwd: string);
    register(): void;
    handle(): Promise<void>;
    generateByConfig(config: AutoloadConfig): Promise<void>;
    matchFileByGlobPatterns(patterns: string[], includeComment: boolean): Promise<string[]>;
    buildContentFromFileList(files: string[]): string;
    writeDefaultConfigFile(path: string): void;
}
