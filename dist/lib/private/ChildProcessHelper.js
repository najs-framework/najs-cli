"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Semver = require("semver");
const ChildProcess = require("child_process");
exports.ChildProcessHelper = {
    hasYarn() {
        const version = ChildProcess.execSync('yarn --version')
            .toString()
            .trim();
        return Semver.valid(version) ? true : false;
    },
    async exec(command) {
        return new Promise(resolve => {
            const childProcess = ChildProcess.exec(command, function () { });
            childProcess.unref();
            childProcess.stdout.on('data', function (data) {
                process.stdout.write(data);
            });
            childProcess.stderr.on('data', function (data) {
                process.stderr.write(data);
            });
            childProcess.on('close', function () {
                resolve();
            });
        });
    }
};
