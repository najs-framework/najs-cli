"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const FileSystem = require("fs");
const lodash_1 = require("lodash");
const CodeTemplate_1 = require("../private/CodeTemplate");
const ChildProcessHelper_1 = require("../private/ChildProcessHelper");
const GlobalCommandBase_1 = require("./GlobalCommandBase");
class CreateCommand extends GlobalCommandBase_1.GlobalCommandBase {
    register() {
        this.cli
            .command('create <app-name>')
            .description('Create new najs application')
            .option('-a, --app-version <version>', 'Version of your application', '0.0.1')
            .action(async (name, command) => {
            this.name = name;
            this.version = command['appVersion'];
            await this.handle();
        });
    }
    path(...args) {
        return Path.join(this.cwd, this.name, ...args);
    }
    async handle() {
        this.assertAppNameDoesNotExistsAndMakeDirectory();
        this.createDirectoryStructure(this.getDirectoryStructure(), this.path());
        await new CodeTemplate_1.CodeTemplate('package.json')
            .with('name', this.name)
            .with('version', this.version)
            .writeToPath(this.path('package.json'));
        await this.createFilesInCWD();
        await this.installPackage();
        await this.createAutoload();
    }
    assertAppNameDoesNotExistsAndMakeDirectory() {
        const path = Path.join(this.cwd, this.name);
        if (FileSystem.existsSync(path)) {
            throw new Error('Directory ' + path + ' is exists, could not create application');
        }
        FileSystem.mkdirSync(path);
    }
    getDirectoryStructure() {
        return {
            '.vscode': true,
            app: {
                Console: true,
                Events: true,
                Http: {
                    Controllers: true,
                    Middleware: true
                },
                Jobs: true,
                Listeners: true,
                Mail: true,
                Models: true,
                Notifications: true,
                Policies: true,
                Providers: true,
                Rules: true,
                storage: {
                    logs: true
                }
            },
            bootstrap: true,
            config: true,
            public: true,
            resources: {
                view: {
                    layout: true
                }
            },
            routes: true,
            test: true
        };
    }
    createDirectoryStructure(structure, base) {
        for (const name in structure) {
            if (structure[name] === false) {
                continue;
            }
            const path = Path.join(base, name);
            FileSystem.mkdirSync(path);
            if (lodash_1.isObject(structure[name])) {
                this.createDirectoryStructure(structure[name], path);
            }
        }
    }
    async installPackage() {
        const cmd = ChildProcessHelper_1.ChildProcessHelper.hasYarn() ? 'yarn install' : 'npm install';
        await ChildProcessHelper_1.ChildProcessHelper.exec(`cd ${this.name} && ${cmd}`);
    }
    async createAutoload() {
        await ChildProcessHelper_1.ChildProcessHelper.exec(`cd ${this.name} && najs-cli autoload`);
    }
    async createFilesInCWD() {
        await new CodeTemplate_1.CodeTemplate('.gitignore').writeToPath(this.path('.gitignore'));
        await new CodeTemplate_1.CodeTemplate('autoload.json').writeToPath(this.path('autoload.json'));
        await new CodeTemplate_1.CodeTemplate('index.ts').writeToPath(this.path('index.ts'));
        await new CodeTemplate_1.CodeTemplate('.vscode', 'extensions.json').writeToPath(this.path('.vscode', 'extensions.json'));
        await new CodeTemplate_1.CodeTemplate('.vscode', 'settings.json').writeToPath(this.path('.vscode', 'settings.json'));
        await new CodeTemplate_1.CodeTemplate('config', 'default.js').writeToPath(this.path('config', 'default.js'));
    }
}
exports.CreateCommand = CreateCommand;
