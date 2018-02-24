"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const FileSystem = require("fs");
const Glob = require("glob");
const Async = require("async");
const GlobalCommandBase_1 = require("./GlobalCommandBase");
const CodeTemplate_1 = require("../private/CodeTemplate");
class AutoloadCommand extends GlobalCommandBase_1.GlobalCommandBase {
    register() {
        this.cli
            .command('autoload')
            .description('Create autoload file')
            .action(() => this.handle());
        this.cli
            .command('dumpautoload')
            .description('Create autoload file (alias of autoload)')
            .action(() => this.handle());
        this.cli
            .command('dump-autoload')
            .description('Create autoload file (alias of autoload)')
            .action(() => this.handle());
    }
    async handle() {
        const autoloadJsonPath = Path.join(this.cwd, 'autoload.json');
        const configTemplate = new CodeTemplate_1.CodeTemplate('autoload.json');
        let config;
        if (FileSystem.existsSync(autoloadJsonPath)) {
            config = require(autoloadJsonPath);
        }
        else {
            config = JSON.parse(await configTemplate.getTemplateContent());
            configTemplate.writeToPath(autoloadJsonPath);
        }
        for (const file in config) {
            await this.generateAutoloadFile(file, config[file]);
        }
    }
    async generateAutoloadFile(fileName, config) {
        const excluded = await this.matchFileByGlobPatterns(config.excluded, {}, false);
        const included = await this.matchFileByGlobPatterns(config.included, { register: false }, true);
        const result = included.filter((item) => excluded.findIndex(excludedItem => excludedItem.type === 'file' && excludedItem.path === item.path) === -1);
        const template = new CodeTemplate_1.CodeTemplate('autoload.ts');
        template.with('content', this.buildContentFromFileList(result));
        template.writeToPath(Path.join(this.cwd, fileName));
    }
    async matchFileByGlobPatterns(input, defaultOptions, includePattern) {
        const isUsingInputAsAnObject = !Array.isArray(input);
        const patterns = isUsingInputAsAnObject ? Object.keys(input) : input;
        return new Promise((resolve, reject) => {
            // I have to use async here to maintain order of result matched by patterns
            Async.reduce(patterns, [], function (result, pattern, next) {
                Glob(pattern, {}, function (error, files) {
                    if (error) {
                        throw error;
                    }
                    if (includePattern) {
                        result.push({
                            path: pattern,
                            pattern: pattern,
                            type: 'pattern',
                            options: Object.assign({}, isUsingInputAsAnObject ? input[pattern] : {})
                        });
                    }
                    for (const file of files) {
                        result.push({
                            path: file,
                            pattern: pattern,
                            type: 'file',
                            options: Object.assign({}, defaultOptions, isUsingInputAsAnObject ? input[pattern] : {})
                        });
                    }
                    next(undefined, result);
                });
            }, function (error, result) {
                if (error) {
                    return reject(error);
                }
                resolve(result.filter((item, index, self) => index === self.findIndex((matched) => matched.path === item.path)));
            });
        });
    }
    buildContentFromFileList(items) {
        const lines = [];
        for (const item of items) {
            if (item.type === 'pattern') {
                this.buildContentFromGlobMatchItemTypePattern(lines, item);
                continue;
            }
            this.buildContentFromGlobMatchItemTypeFile(lines, item);
        }
        return lines.join('\n');
    }
    buildContentFromGlobMatchItemTypePattern(lines, item) {
        lines.push('');
        lines.push(`// ${item.pattern}`);
    }
    buildContentFromGlobMatchItemTypeFile(lines, item) {
        const hasRegister = item.options && item.options['register'];
        let importPath = './';
        if (item.path.endsWith('.ts')) {
            importPath += item.path.substr(0, item.path.length - 3);
        }
        if (!hasRegister) {
            lines.push(`import '${importPath}'`);
            return;
        }
        const name = importPath
            .substr(2)
            .split('.')
            .join('_')
            .split(Path.sep)
            .join('_');
        lines.push(`import * as ${name} from '${importPath}'`);
        lines.push(`register_classes(${name})`);
    }
}
exports.AutoloadCommand = AutoloadCommand;
