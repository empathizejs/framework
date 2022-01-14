import dir from '../paths/dir';
export default class Configs {
    /**
     * Get config value
     *
     * @param name config name, e.g. "example.name"
     *
     * @returns undefined if config doesn't exist. Otherwise - config value
     */
    static get(name = '') {
        return new Promise(async (resolve) => {
            Neutralino.filesystem.readFile(this.file).then((config) => {
                config = this.unserialize(config);
                if (name !== '') {
                    name.split('.').forEach((value) => {
                        config = config[value];
                    });
                }
                resolve(config);
            }).catch(() => {
                setTimeout(() => resolve(this.get(name)), 100);
            });
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
            Neutralino.filesystem.readFile(this.file).then(async (config) => {
                config = this.serialize(getUpdatedArray(name.split('.'), this.unserialize(config), value));
                Neutralino.filesystem.writeFile(this.file, config)
                    .then(() => resolve());
            }).catch(async () => {
                let config = this.serialize(getUpdatedArray(name.split('.'), {}, value));
                Neutralino.filesystem.writeFile(this.file, config)
                    .then(() => resolve());
            });
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
                Neutralino.filesystem.writeFile(this.file, this.serialize(updateDefaults(current, configs)))
                    .then(() => resolve());
            };
            Neutralino.filesystem.readFile(this.file)
                .then((config) => setDefaults(this.unserialize(config)))
                .catch(() => setDefaults({}));
        });
    }
}
/**
 * A function that will encode an object to a string
 *
 * @default JSON.stringify
 */
Configs.serialize = JSON.stringify;
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
;
