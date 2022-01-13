export default class dir {
    protected static dirs: {
        temp: null;
        data: null;
        documents: null;
        pictures: null;
        music: null;
        video: null;
        downloads: null;
    };
    protected static resolvePath(name: string): Promise<string>;
    /**
     * System temp directory path
     */
    static get temp(): Promise<string>;
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
