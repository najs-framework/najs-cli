import { GlobalCommandBase } from './GlobalCommandBase';
export declare type AutoloadConfig = {
    included: string[];
    excluded: string[];
};
export declare class AutoloadCommand extends GlobalCommandBase {
    register(): void;
    handle(): Promise<void>;
    generateByConfig(config: AutoloadConfig): Promise<void>;
    matchFileByGlobPatterns(patterns: string[], includeComment: boolean): Promise<string[]>;
    buildContentFromFileList(files: string[]): string;
}
