declare type Record = {
    expired: boolean;
    value: any;
};
export default class Cache {
    /**
     * File where cache should be stored
     */
    static file: string | Promise<string>;
    protected static cache: object | null;
    /**
     * Get cached value
     *
     * @returns null if this value is not cached
     */
    static get(name: string): Promise<Record | null>;
    /**
     * Cache value
     *
     * @param name name of the value to cache
     * @param value value to cache
     * @param ttl number of seconds to cache
     *
     * @returns promise that indicates when the value will be cached
     */
    static set(name: string, value: any, ttl?: number | null): Promise<void>;
    /**
     * Clear launcher cache
     *
     * @returns false if failed to delete cache file when removeFile = true
     */
    static clear(removeFile?: boolean): Promise<boolean>;
}
export type { Record };
