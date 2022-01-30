import dir from '../paths/dir.js';

declare const Neutralino;

// Ok yea, null, object and boolean aren't scalars
// but I don't care
type scalar = null | string | number | boolean | object;

export default class Configs
{
    /**
     * A function that will encode an object to a string
     * 
     * @default JSON.stringify(..., null, 4)
     */
    public static serialize: (data: any) => string = (value) => JSON.stringify(value, null, 4);

    /**
     * A function that will decode an object from a string
     * 
     * @default JSON.parse
     */
    public static unserialize: (data: string) => any = JSON.parse;

    /**
     * Path to file where the config will be stored
     * 
     * @default "./config.json"
     */
    public static file: string|Promise<string> = `${dir.app}/config.json`;

    /**
     * Automatically flush changes in configs to file
     * 
     * If false, then changes will be stored in memory until
     * flush() method will be called
     * 
     * @default true
     */
    public static autoFlush = true;

    protected static _configs: object|null = null;

    protected static get configs(): Promise<object>
    {
        return new Promise(async (resolve) => {
            if (this._configs === null || this.autoFlush)
            {
                if (typeof this.file !== 'string')
                    this.file = await this.file;
                
                Neutralino.filesystem.readFile(this.file)
                    .then((config) => {
                        this._configs = this.unserialize(config);

                        resolve(this._configs!);
                    })
                    .catch(() => resolve({}));
            }

            else resolve(this._configs);
        });
    }

    protected static set configs(configs: object)
    {
        this._configs = configs;
    }

    /**
     * Get config value
     * 
     * @param name config name, e.g. "example.name"
     * 
     * @returns undefined if config doesn't exist. Otherwise - config value
     */
    public static get(name: string = ''): Promise<undefined|scalar|scalar[]>
    {
        return new Promise(async (resolve) => {
            let config = await this.configs;

            if (name !== '')
                for (const value of name.split('.'))
                {
                    config = config[value];

                    if (config === undefined)
                        break;
                }

            resolve(config);
        });
    }

    /**
     * Set config value
     * 
     * @param name config name, e.g. "example.name"
     * @param value config value, e.g. "example value"
     * 
     * @returns Promise<void> indicates if the settings were updated
     */
    public static set(name: string, value: scalar|scalar[]|Promise<scalar|scalar[]>): Promise<void>
    {
        const getUpdatedArray = (path: string[], array: scalar|scalar[], value: scalar|scalar[]): scalar|scalar[] => {
            array![path[0]] = path.length > 1 ?
                getUpdatedArray(path.slice(1), array![path[0]] ?? {}, value) : value;

            return array;
        };

        return new Promise(async (resolve) => {
            value = await Promise.resolve(value);
            
            this.configs = getUpdatedArray(name.split('.'), await this.configs, value) as object;

            this.autoFlush ?
                this.flush().then(resolve) :
                resolve();
        });
    }

    /**
     * Remove configs value
     * 
     * @returns Promise<void> indicates when the configs will be updated
     */
    public static remove(name: string): Promise<void>
    {
        return new Promise(async (resolve) => {
            const getFilteredArray = (array: object, path: string[]) => {
                if (array[path[0]] === undefined)
                    return array;

                else if (path.length === 1)
                {
                    delete array[path[0]];

                    return array;
                }

                else
                {
                    array[path[0]] = getFilteredArray(array[path[0]], path.slice(1));

                    return array;
                }
            };

            this.configs = getFilteredArray(await this.configs, name.split('.'));

            this.autoFlush ?
                this.flush().then(resolve) :
                resolve();
        });
    }

    /**
     * Set default values
     * 
     * @param configs object of default values
     * 
     * @returns Promise<void> indicates if the default settings were applied
     */
    public static defaults(configs: object): Promise<void>
    {
        return new Promise(async (resolve) => {
            const setDefaults = async (current: object) => {
                const updateDefaults = (current: object, defaults: object) => {
                    Object.keys(defaults).forEach((key) => {
                        // If the field exists in defaults and doesn't exist in current
                        if (current[key] === undefined)
                            current[key] = defaults[key];

                        // If both default and current are objects
                        // and we also should check if they're not nulls
                        // because JS thinks that [typeof null === 'object']
                        else if (typeof current[key] == 'object' && typeof defaults[key] == 'object' && current[key] !== null && defaults[key] !== null)
                            current[key] = updateDefaults(current[key], defaults![key]);
                    });

                    return current;
                };

                this.configs = updateDefaults(current, configs);

                this.autoFlush ?
                    this.flush().then(resolve) :
                    resolve();
            };

            setDefaults(await this.configs);
        });
    }

    /**
     * Write all config changes to the file
     */
    public static flush(): Promise<void>
    {
        return new Promise(async (resolve) => {
            if (typeof this.file !== 'string')
                this.file = await this.file;
            
            Neutralino.filesystem.writeFile(this.file, this.serialize(this._configs ?? {}))
                .then(() => resolve());
        });
    }

    /**
     * Load configs from the file
     * 
     * Used to sync [autoFlush = false] configs changes
     * in different windows
     */
    public static load(): Promise<void>
    {
        this._configs = null;

        return new Promise(async (resolve) => {
            this._configs = await this.configs;

            resolve();
        });
    }
};

export type { scalar };
