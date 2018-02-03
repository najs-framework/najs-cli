/**
 * Check path is a najs application or not
 *
 * There are 2 conditions based on path (~/)
 *   1. ~/package.json exists and has "najs" package in dependencies section
 *   2. ~/config directory exists
 */
export declare function is_najs_application(path: string): boolean;
