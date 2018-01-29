#!/usr/bin/env node

const cli = require('commander')
const path = require('path')
const commands = require('../dist/commands')
const package = require(path.join(__dirname, '../package.json'))
commands.load(cli, package).parse(process.argv)
