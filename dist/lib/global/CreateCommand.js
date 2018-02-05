"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const FileSystem = require("fs");
const ChildProcess = require("child_process");
const Semver = require("semver");
const CodeTemplate_1 = require("../templates/CodeTemplate");
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
        await new CodeTemplate_1.CodeTemplate('package.json')
            .with('name', this.name)
            .with('version', this.version)
            .writeToPath(this.path('package.json'));
        await this.createFilesInCWD();
        await this.installPackage();
    }
    async installPackage() {
        return new Promise(resolve => {
            const cmd = this.hasYarn() ? 'yarn install' : 'npm install';
            const installer = ChildProcess.exec(`cd ${this.name} && ${cmd}`, function () { });
            installer.unref();
            installer.stdout.on('data', function (data) {
                process.stdout.write(data);
            });
            installer.stderr.on('data', function (data) {
                process.stderr.write(data);
            });
            installer.on('close', function () {
                resolve();
            });
        });
    }
    hasYarn() {
        const version = ChildProcess.execSync('yarn --version')
            .toString()
            .trim();
        return Semver.valid(version) ? true : false;
    }
    assertAppNameDoesNotExistsAndMakeDirectory() {
        const path = Path.join(this.cwd, this.name);
        if (FileSystem.existsSync(path)) {
            throw new Error('Directory ' + path + ' is exists, could not create application');
        }
        FileSystem.mkdirSync(path);
    }
    async createFilesInCWD() {
        await new CodeTemplate_1.CodeTemplate('.gitignore').writeToPath(this.path('.gitignore'));
        await new CodeTemplate_1.CodeTemplate('autoload.json').writeToPath(this.path('autoload.json'));
    }
}
exports.CreateCommand = CreateCommand;
