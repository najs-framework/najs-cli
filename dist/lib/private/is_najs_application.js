"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const FileSystem = require("fs");
/**
 * Check path is a najs application or not
 *
 * There are 2 conditions based on path (~/)
 *   1. ~/package.json exists and has "najs" package in dependencies section
 *   2. ~/config directory exists
 */
function is_najs_application(path) {
    const packageJsonPath = Path.join(path, 'package.json');
    if (!FileSystem.existsSync(packageJsonPath)) {
        return false;
    }
    const packageInfo = require(packageJsonPath);
    if (!has_najs_in_dependencies(packageInfo, 'dependencies') &&
        !has_najs_in_dependencies(packageInfo, 'devDependencies') &&
        !has_najs_in_dependencies(packageInfo, 'peerDependencies')) {
        return false;
    }
    return true;
}
exports.is_najs_application = is_najs_application;
function has_najs_in_dependencies(packageInfo, key) {
    if (typeof packageInfo[key] === 'undefined' || packageInfo[key]['najs'] === 'undefined') {
        return false;
    }
    return true;
}
