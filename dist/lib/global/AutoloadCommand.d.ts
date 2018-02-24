import { GlobalCommandBase } from './GlobalCommandBase';
export declare type AutoloadConfigItem = {
    included: string[] | Object;
    excluded: string[] | Object;
};
export declare type AutoloadConfig = {
    [key: string]: AutoloadConfigItem;
};
export declare type GlobMatchedItem = {
    path: string;
    pattern: string;
    type: string;
    options: Object;
};
export declare class AutoloadCommand extends GlobalCommandBase {
    register(): void;
    handle(): Promise<void>;
    generateAutoloadFile(fileName: string, config: AutoloadConfigItem): Promise<void>;
    matchFileByGlobPatterns(input: string[] | Object, defaultOptions: Object, includePattern: boolean): Promise<GlobMatchedItem[]>;
    buildContentFromFileList(items: GlobMatchedItem[]): string;
    buildContentFromGlobMatchItemTypePattern(lines: string[], item: GlobMatchedItem): void;
    buildContentFromGlobMatchItemTypeFile(lines: string[], item: GlobMatchedItem): void;
}
