"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function load(cli, packageInfo, cwd) {
    console.log(cwd);
    cli.version(packageInfo['version'], '-v, --version').description(packageInfo['description']);
    return cli;
}
exports.load = load;
