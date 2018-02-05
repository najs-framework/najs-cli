import * as Commander from 'commander';
export declare abstract class GlobalCommandBase {
    cli: Commander.Command;
    cwd: string;
    constructor(cli: Commander.Command, cwd: string);
    abstract register(): void;
}
