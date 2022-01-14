declare type scalar = null | string | number | boolean | object;
export default class Configs {
    /**
     * A function that will encode an object to a string
     *
     * @default JSON.stringify
     */
    static serialize: {
        (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
        (value: any, replacer?: (string | number)[], space?: string | number): string;
    };
    /**
     * A function that will decode an object from a string
     *
     * @default JSON.parse
     */
    static unserialize: (text: string, reviver?: (this: any, key: string, value: any) => any) => any;
    /**
     * Path to file where the config will be stored
     *
     * @default "./config.json"
     */
    static file: string;
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
     * Set default values
     *
     * @param configs object of default values
     *
     * @returns Promise<void> indicates if the default settings were applied
     */
    static defaults(configs: object): Promise<void>;
}
export type { scalar };
