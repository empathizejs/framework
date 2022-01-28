import dir from '../paths/dir';
import Debug from './Debug';

type Record = {
    expired: boolean;
    value: any;
};

declare const Neutralino;
declare const NL_APPID;

export default class Cache
{
    /**
     * File where cache should be stored
     */
    public static file: string = `${dir.temp}/.${NL_APPID}.cache.json`;

    // Locally stored cache to not to access
    // cache.json file every time we want to find something
    protected static cache: object|null = null;

    /**
     * Get cached value
     * 
     * @returns null if this value is not cached
     */
    public static get(name: string): Promise<Record|null>
    {
        return new Promise(async (resolve) => {
            if (this.cache !== null && this.cache[name] !== undefined)
            {
                const expired = this.cache[name].ttl !== null ? Date.now() > this.cache[name].ttl * 1000 : false;

                Debug.log({
                    function: 'Cache.get',
                    message: [
                        `Resolved ${expired ? 'expired' : 'unexpired'} hot cache record`,
                        `[name] ${name}`,
                        `[value] ${JSON.stringify(this.cache[name].value)}`
                    ]
                });

                resolve({
                    expired: expired,
                    value: this.cache[name].value
                });
            }
            
            else Neutralino.filesystem.readFile(this.file)
                .then((cache) => {
                    this.cache = JSON.parse(cache);

                    if (this.cache![name] === undefined)
                        resolve(null);

                    else
                    {
                        const output = {
                            expired: this.cache![name].ttl !== null ? Date.now() > this.cache![name].ttl * 1000 : false,
                            value: this.cache![name].value
                        };

                        Debug.log({
                            function: 'Cache.get',
                            message: [
                                `Resolved ${output.expired ? 'expired' : 'unexpired'} cache`,
                                `[name] ${name}`,
                                `[value] ${JSON.stringify(output.value)}`
                            ]
                        });

                        resolve(output);
                    }
                })
                .catch(() => resolve(null));
        });
    }

    /**
     * Cache value
     * 
     * @param name name of the value to cache
     * @param value value to cache
     * @param ttl number of seconds to cache
     * 
     * @returns promise that indicates when the value will be cached
     */
    public static set(name: string, value: any, ttl: number|null = null): Promise<void>
    {
        return new Promise((resolve) => {
            const writeCache = () => {
                Debug.log({
                    function: 'Cache.set',
                    message: [
                        'Caching data:',
                        `[ttl] ${ttl}`,
                        `[value] ${JSON.stringify(value)}`
                    ]
                });
                
                this.cache![name] = {
                    ttl: ttl !== null ? Math.round(Date.now() / 1000) + ttl : null,
                    value: value
                };

                Neutralino.filesystem.writeFile(this.file, JSON.stringify(this.cache))
                    .then(() => resolve());
            };
            
            if (this.cache === null)
            {
                Neutralino.filesystem.readFile(this.file)
                    .then((cacheRaw) => 
                    {
                        this.cache = JSON.parse(cacheRaw);

                        writeCache();
                    })
                    .catch(() => {
                        this.cache = {};

                        writeCache();
                    });
            }

            else writeCache();
        });
    }
};

export type { Record };
