"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileSystem = require("fs");
const Path = require("path");
const Ejs = require("ejs");
class CodeTemplate {
    constructor(template) {
        this.template = template;
        this.templatePath = Path.resolve(__dirname, '..', '..', '..', 'templates', template + '.ejs');
        if (!FileSystem.existsSync(this.templatePath)) {
            throw new Error('Template ' + template + ' not found.');
        }
        this.variables = {};
    }
    with(name, value) {
        this.variables[name] = value;
        return this;
    }
    async getTemplateContent() {
        return new Promise((resolve, reject) => {
            FileSystem.readFile(this.templatePath, 'utf8', function (error, contents) {
                if (error) {
                    return reject(error);
                }
                resolve(contents);
            });
        });
    }
    async getContent() {
        const content = await this.getTemplateContent();
        return Ejs.render(content, this.variables);
    }
    async writeToPath(path, overrideIfExists = true) {
        if (FileSystem.existsSync(path)) {
            if (!overrideIfExists) {
                throw new Error('File ' + path + ' exists, could not override it.');
            }
            FileSystem.unlinkSync(path);
        }
        const stream = FileSystem.createWriteStream(path);
        return stream.once('open', async () => {
            stream.write(await this.getContent());
            stream.end();
        });
    }
}
exports.CodeTemplate = CodeTemplate;
