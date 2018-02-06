import * as Semver from 'semver'
import * as ChildProcess from 'child_process'

export const ChildProcessHelper = {
  hasYarn(): boolean {
    const version: any = ChildProcess.execSync('yarn --version')
      .toString()
      .trim()
    return Semver.valid(version) ? true : false
  },

  async exec(command: string) {
    return new Promise(resolve => {
      const childProcess: ChildProcess.ChildProcess = ChildProcess.exec(command, function() {})
      childProcess.unref()
      childProcess.stdout.on('data', function(data: any) {
        process.stdout.write(data)
      })
      childProcess.stderr.on('data', function(data: any) {
        process.stderr.write(data)
      })
      childProcess.on('close', function() {
        resolve()
      })
    })
  }
}