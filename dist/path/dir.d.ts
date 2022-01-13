export default class dir {
    protected static dirs: {
        temp: any;
        data: any;
        documents: any;
        pictures: any;
        music: any;
        video: any;
        downloads: any;
    };
    protected static resolvePath(name: string): Promise<string>;
    /**
     * Current working directory
     */
    static cwd: string;
    /**
     * Application path
     */
    static app: string;
    /**
     * System temp directory path
     */
    static temp: string;
    /**
     * System data directory path
     */
    static get data(): Promise<string>;
    /**
     * System documents directory path
     */
    static get documents(): Promise<string>;
    /**
     * System pictures directory path
     */
    static get pictures(): Promise<string>;
    /**
     * System music directory path
     */
    static get music(): Promise<string>;
    /**
     * System video directory path
     */
    static get video(): Promise<string>;
    /**
     * System downloads directory path
     */
    static get downloads(): Promise<string>;
}
