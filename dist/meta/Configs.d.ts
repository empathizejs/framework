declare type scalar = null | string | number | boolean | object;
export default class Configs {
    /**
     * A function that will encode an object to a string
     *
     * @default JSON.stringify(..., null, 4)
     */
    static serialize: (data: any) => string;
    /**
     * A function that will decode an object from a string
     *
     * @default JSON.parse
     */
    static unserialize: (data: string) => any;
    /**
     * Path to file where the config will be stored
     *
     * @default "./config.json"
     */
    static file: string | Promise<string>;
    /**
     * Automatically flush changes in configs to file
     *
     * If false, then changes will be stored in memory until
     * flush() method will be called
     *
     * @default true
     */
    static autoFlush: boolean;
    protected static _configs: object | null;
    protected static get configs(): Promise<object>;
    protected static set configs(configs: object);
    /**
     * Get config value
     *
     * @param name config name, e.g. "example.name"
     *
     * @returns undefined if config doesn't exist. Otherwise - config value
     */
    static get(name?: string): Promise<undefined | scalar | scalar[]>;
    /**
     * Set config value
     *
     * @param name config name, e.g. "example.name"
     * @param value config value, e.g. "example value"
     *
     * @returns Promise<void> indicates if the settings were updated
     */
    static set(name: string, value: scalar | scalar[] | Promise<scalar | scalar[]>): Promise<void>;
    /**
     * Remove configs value
     *
     * @returns Promise<void> indicates when the configs will be updated
     */
    static remove(name: string): Promise<void>;
    /**
     * Set default values
     *
     * @param configs object of default values
     *
     * @returns Promise<void> indicates if the default settings were applied
     */
    static defaults(configs: object): Promise<void>;
    /**
     * Write all config changes to the file
     */
    static flush(): Promise<void>;
    /**
     * Load configs from the file
     *
     * Used to sync [autoFlush = false] configs changes
     * in different windows
     */
    static load(): Promise<void>;
}
export type { scalar };
