export default class path {
    /**
     * Join names to the path string
     */
    static join(...args) {
        return this.normalize(args);
    }
    /**
     * Normalize path
     *
     * @example path.normalize('../../example') -> '../../example'
     *
     * @example path.normalize('test/../../example') -> '../example'
     */
    static normalize(path) {
        const pathnames = (typeof path === 'string' ? path.split(this.separator) : path)
            .filter((name) => name !== '');
        let normalized = [];
        for (let i = 0; i < pathnames.length; i++)
            if (pathnames[i] === '..') {
                if (normalized.length > 0 && normalized[normalized.length - 1] !== '..')
                    normalized.pop();
                else
                    normalized.push('..');
            }
            else if (pathnames[i] !== '.')
                normalized.push(pathnames[i]);
        return normalized.join(this.separator);
    }
    /**
     * Return relative path from base path
     *
     * @example path.relative('test1/test2', 'test/test3') -> '../../test1/test2'
     *
     * @example path.relative('test/test2', 'test/test1') -> '../test2'
     *
     * @example path.relative('test', 'test') -> ''
     */
    static relative(path, base) {
        const pathnames = this.normalize(path).split(this.separator);
        const basenames = this.normalize(base).split(this.separator);
        let relative = [], diffIndex = 0;
        while (basenames[diffIndex] !== undefined) {
            if (pathnames[diffIndex] !== basenames[diffIndex])
                break;
            ++diffIndex;
        }
        for (let i = basenames.length - diffIndex; i > 0; i--)
            relative.push('..');
        while (pathnames[diffIndex] !== undefined)
            relative.push(pathnames[diffIndex++]);
        return relative.join(this.separator);
    }
    /**
     * Encode string
     *
     * Replace '\a\b' to '\\\a\\\b', and replace ''' to '\\''
     *
     * Can be useful in `Process.run()`
     *
     * @example Process.run(`ping "${paths.addSlashes('vk.com')}"`) -> Process.run('ping "vk.com"')
     */
    static addSlashes(str) {
        return str.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
    }
}
/**
 * System pathes separator
 */
path.separator = '/';
/**
 * Default pathes delimiter
 */
path.delimiter = ':';
;
