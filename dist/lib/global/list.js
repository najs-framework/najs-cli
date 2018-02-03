"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function list(cli) {
    cli
        .command('list')
        .description('List all commands ofm application')
        .action(() => { });
}
exports.list = list;
