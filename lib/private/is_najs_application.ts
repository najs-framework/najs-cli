import * as Path from 'path'
import * as FileSystem from 'fs'
/**
 * Check path is a najs application or not
 *
 * There are 2 conditions based on path (~/)
 *   1. ~/package.json exists and has "najs" package in dependencies section
 *   2. ~/config directory exists
 */
export function is_najs_application(path: string): boolean {
  const packageJsonPath = Path.join(path, 'package.json')
  if (!FileSystem.existsSync(packageJsonPath)) {
    return false
  }
  const packageInfo: Object = require(packageJsonPath)
  if (
    !has_najs_in_dependencies(packageInfo, 'dependencies') &&
    !has_najs_in_dependencies(packageInfo, 'devDependencies') &&
    !has_najs_in_dependencies(packageInfo, 'peerDependencies')
  ) {
    return false
  }

  return true
}

function has_najs_in_dependencies(packageInfo: Object, key: string): boolean {
  if (typeof packageInfo[key] === 'undefined' || packageInfo[key]['najs'] === 'undefined') {
    return false
  }
  return true
}
