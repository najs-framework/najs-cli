#!/usr/bin/env node

const cli = require('commander')
const path = require('path')
const commands = require('../dist/lib')
const package = require(path.join(__dirname, '../package.json'))
commands.load(cli, package, process.cwd()).parse(process.argv)
