"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function list(cli) {
    cli
        .command('list')
        .description('List all commands of application')
        .action(() => { });
}
exports.list = list;
