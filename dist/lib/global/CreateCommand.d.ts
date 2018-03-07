import { GlobalCommandBase } from './GlobalCommandBase';
export declare class CreateCommand extends GlobalCommandBase {
    name: string;
    version: string;
    register(): void;
    path(...args: string[]): string;
    handle(): Promise<void>;
    assertAppNameDoesNotExistsAndMakeDirectory(): void;
    getDirectoryStructure(): {
        '.vscode': boolean;
        app: {
            Console: boolean;
            Events: boolean;
            Http: {
                Controllers: boolean;
                Middleware: boolean;
            };
            Jobs: boolean;
            Listeners: boolean;
            Mail: boolean;
            Models: boolean;
            Notifications: boolean;
            Policies: boolean;
            Providers: boolean;
            Rules: boolean;
            storage: {
                logs: boolean;
            };
        };
        config: boolean;
        cypress: boolean;
        public: boolean;
        resources: {
            view: {
                layout: boolean;
            };
        };
        routes: boolean;
        test: boolean;
    };
    createDirectoryStructure(structure: Object, base: string): void;
    installPackage(): Promise<void>;
    createAutoload(): Promise<void>;
    createFilesInCWD(): Promise<void>;
}
