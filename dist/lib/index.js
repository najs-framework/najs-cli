"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_najs_application_1 = require("./private/is_najs_application");
const list_1 = require("./global/list");
const CreateCommand_1 = require("./global/CreateCommand");
const AutoloadCommand_1 = require("./global/AutoloadCommand");
function load(cli, packageInfo, cwd) {
    cli.version(packageInfo['version'], '-v, --version').description(packageInfo['description']);
    cli.usage('[option]');
    if (is_najs_application_1.is_najs_application(cwd)) {
        list_1.list(cli);
        new AutoloadCommand_1.AutoloadCommand(cli, cwd);
    }
    else {
        new CreateCommand_1.CreateCommand(cli, cwd);
    }
    return cli;
}
exports.load = load;
