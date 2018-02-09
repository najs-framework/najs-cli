import { GlobalCommandBase } from './GlobalCommandBase';
export declare type AutoloadConfigItem = {
    included: string[];
    excluded: string[];
};
export declare type AutoloadConfig = {
    [key: string]: AutoloadConfigItem;
};
export declare class AutoloadCommand extends GlobalCommandBase {
    register(): void;
    handle(): Promise<void>;
    generateAutoloadFile(fileName: string, config: AutoloadConfigItem): Promise<void>;
    matchFileByGlobPatterns(patterns: string[], includeComment: boolean): Promise<string[]>;
    buildContentFromFileList(files: string[]): string;
}
