declare class Stream {
    protected _id: number;
    /**
     * ID of the curl process
     */
    get id(): number;
    /**
     * The interval in ms between progress event calls
     */
    progressInterval: number;
    /**
     * The interval in ms between checking was downloading resumed after pausing
     */
    pauseInterval: number;
    protected uri: string;
    protected output: string;
    protected total: number;
    protected previous: number;
    protected onStart?: () => void;
    protected onProgress?: (current: number, total: number, difference: number) => void;
    protected onFinish?: () => void;
    protected started: boolean;
    protected paused: boolean;
    protected finished: boolean;
    constructor(uri: string, output: string, total: number);
    /**
     * Specify event that will be called when the download gets started
     *
     * @param callback
     */
    start(callback: () => void): void;
    /**
     * Specify event that will be called every [this.progressInterval] ms while the file is downloading
     *
     * @param callback
     */
    progress(callback: (current: number, total: number, difference: number) => void): void;
    /**
     * Specify event that will be called after the file is downloaded
     *
     * @param callback
     */
    finish(callback: () => void): void;
    /**
     * Pause downloading
     */
    pause(): void;
    /**
     * Resume downloading
     */
    resume(): void;
    /**
     * Close downloading stream
     */
    close(forced?: boolean): void;
}
export default class Downloader {
    protected static streams: Stream[];
    /**
     * Download file
     *
     * @param uri file's uri to download
     * @param output relative or absolute path to the file to save it as
     *
     * @returns downloading stream
     */
    static download(uri: string, output?: string | null): Promise<Stream>;
    /**
     * Get a file name from the URI
     */
    static fileFromUri(uri: string): string;
    /**
     * Close every open downloading stream
     */
    static closeStreams(forced?: boolean): void;
}
export { Stream };
