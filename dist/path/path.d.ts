export default class path {
    /**
     * System pathes separator
     */
    static readonly separator = "/";
    /**
     * Default pathes delimiter
     */
    static readonly delimiter = ":";
    /**
     * Join names to the path string
     */
    static join(...args: string[]): string;
    /**
     * Normalize path
     *
     * @example path.normalize('../../example') -> '../../example'
     *
     * @example path.normalize('test/../../example') -> '../example'
     */
    static normalize(path: string | string[]): string;
    /**
     * Return relative path from base path
     *
     * @example path.relative('test1/test2', 'test/test3') -> '../../test1/test2'
     *
     * @example path.relative('test/test2', 'test/test1') -> '../test2'
     *
     * @example path.relative('test', 'test') -> ''
     */
    static relative(path: string, base: string): string;
    /**
     * Encode string
     *
     * Replace '\a\b' to '\\\a\\\b', and replace ''' to '\\''
     *
     * Can be useful in `Process.run()`
     *
     * @example Process.run(`ping "${paths.addSlashes('vk.com')}"`) -> Process.run('ping "vk.com"')
     */
    static addSlashes(str: string): string;
}
