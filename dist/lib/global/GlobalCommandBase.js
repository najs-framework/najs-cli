"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GlobalCommandBase {
    constructor(cli, cwd) {
        this.cli = cli;
        this.cwd = cwd;
        this.register();
    }
}
exports.GlobalCommandBase = GlobalCommandBase;
