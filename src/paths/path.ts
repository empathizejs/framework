export default class path
{
    /**
     * System pathes separator
     */
    public static readonly separator = '/';

    /**
     * Default pathes delimiter
     */
    public static readonly delimiter = ':';

    /**
     * Join names to the path string
     */
    public static join(...args: string[]): string
    {
        return this.normalize(args);
    }

    /**
     * Normalize path
     * 
     * @example path.normalize('../../example') -> '../../example'
     * 
     * @example path.normalize('test/../../example') -> '../example'
     */
    public static normalize(path: string|string[]): string
    {
        const pathnames = (typeof path === 'string' ? path.split(this.separator) : path)
            .filter((name) => name !== '');

        let normalized: string[] = [];

        for (let i = 0; i < pathnames.length; i++)
            if (pathnames[i] === '..')
            {
                if (normalized.length > 0 && normalized[normalized.length - 1] !== '..')
                    normalized.pop();

                else normalized.push('..');
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
    public static relative(path: string, base: string): string
    {
        const pathnames = this.normalize(path).split(this.separator);
        const basenames = this.normalize(base).split(this.separator);

        let relative: string[] = [], diffIndex = 0;

        while (basenames[diffIndex] !== undefined)
        {
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
    public static addSlashes(str: string): string
    {
        return str.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
    }
};
