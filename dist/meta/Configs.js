import dir from '../paths/dir';
export default class Configs {
    static get configs() {
        return new Promise(async (resolve) => {
            if (this._configs === null || this.autoFlush) {
                if (typeof this.file !== 'string')
                    this.file = await this.file;
                Neutralino.filesystem.readFile(this.file)
                    .then((config) => {
                    this._configs = this.unserialize(config);
                    resolve(this._configs);
                })
                    .catch(() => resolve({}));
            }
            else
                resolve(this._configs);
        });
    }
    static set configs(configs) {
        this._configs = configs;
    }
    /**
     * Get config value
     *
     * @param name config name, e.g. "example.name"
     *
     * @returns undefined if config doesn't exist. Otherwise - config value
     */
    static get(name = '') {
        return new Promise(async (resolve) => {
            let config = await this.configs;
            if (name !== '')
                for (const value of name.split('.')) {
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
    static set(name, value) {
        const getUpdatedArray = (path, array, value) => {
            array[path[0]] = path.length > 1 ?
                getUpdatedArray(path.slice(1), array[path[0]] ?? {}, value) : value;
            return array;
        };
        return new Promise(async (resolve) => {
            value = await Promise.resolve(value);
            this.configs = getUpdatedArray(name.split('.'), await this.configs, value);
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
    static defaults(configs) {
        return new Promise(async (resolve) => {
            const setDefaults = async (current) => {
                const updateDefaults = (current, defaults) => {
                    Object.keys(defaults).forEach((key) => {
                        // If the field exists in defaults and doesn't exist in current
                        if (current[key] === undefined)
                            current[key] = defaults[key];
                        // If both default and current are objects
                        // and we also should check if they're not nulls
                        // because JS thinks that [typeof null === 'object']
                        else if (typeof current[key] == 'object' && typeof defaults[key] == 'object' && current[key] !== null && defaults[key] !== null)
                            current[key] = updateDefaults(current[key], defaults[key]);
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
    static flush() {
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
    static load() {
        this._configs = null;
        return new Promise(async (resolve) => {
            this._configs = await this.configs;
            resolve();
        });
    }
}
/**
 * A function that will encode an object to a string
 *
 * @default JSON.stringify(..., null, 4)
 */
Configs.serialize = (value) => JSON.stringify(value, null, 4);
/**
 * A function that will decode an object from a string
 *
 * @default JSON.parse
 */
Configs.unserialize = JSON.parse;
/**
 * Path to file where the config will be stored
 *
 * @default "./config.json"
 */
Configs.file = `${dir.app}/config.json`;
/**
 * Automatically flush changes in configs to file
 *
 * If false, then changes will be stored in memory until
 * flush() method will be called
 *
 * @default true
 */
Configs.autoFlush = true;
Configs._configs = null;
;
