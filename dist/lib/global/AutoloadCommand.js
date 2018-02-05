"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const FileSystem = require("fs");
const Glob = require("glob");
const Async = require("async");
const GlobalCommandBase_1 = require("./GlobalCommandBase");
const CodeTemplate_1 = require("../templates/CodeTemplate");
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
        return this.generateByConfig(config);
    }
    async generateByConfig(config) {
        const excluded = await this.matchFileByGlobPatterns(config.excluded, false);
        const included = await this.matchFileByGlobPatterns(config.included, true);
        const result = included.filter(item => excluded.indexOf(item) === -1);
        const template = new CodeTemplate_1.CodeTemplate('autoload.ts');
        template.with('content', this.buildContentFromFileList(result));
        template.writeToPath(Path.join(this.cwd, 'autoload.ts'));
    }
    async matchFileByGlobPatterns(patterns, includeComment) {
        return new Promise((resolve, reject) => {
            // I have to use async here to maintain order of result matched by patterns
            Async.reduce(patterns, [], function (result, pattern, next) {
                Glob(pattern, {}, function (error, files) {
                    if (error) {
                        throw error;
                    }
                    next(undefined, result.concat(includeComment ? ['// "' + pattern + '"'] : [], files));
                });
            }, function (error, result) {
                if (error) {
                    return reject(error);
                }
                resolve(Array.from(new Set(result)));
            });
        });
    }
    buildContentFromFileList(files) {
        const lines = [];
        for (const file of files) {
            if (file.indexOf('//') === 0) {
                lines.push('');
                lines.push(file);
                continue;
            }
            let importPath = './';
            if (file.endsWith('.ts')) {
                importPath += file.substr(0, file.length - 3);
            }
            lines.push(`import '${importPath}'`);
        }
        return lines.join('\n');
    }
}
exports.AutoloadCommand = AutoloadCommand;
