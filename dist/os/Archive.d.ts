declare type ArchiveType = 'tar' | 'zip' | '7z';
declare type Size = {
    compressed?: number | null;
    uncompressed?: number | null;
};
declare type File = {
    path: string;
    size: Size;
};
declare type ArchiveInfo = {
    size: Size;
    type: ArchiveType;
    files: File[];
};
declare class Stream {
    protected _id: number;
    /**
     * ID of the archive unpacker process
     */
    get id(): number;
    /**
     * The interval in ms between progress event calls
     */
    progressInterval: number;
    protected path: string;
    protected unpackDir: string | null;
    protected unpacked: number;
    protected archive?: ArchiveInfo;
    protected onStart?: () => void;
    protected onProgress?: (current: number, total: number, difference: number) => void;
    protected onFinish?: () => void;
    protected onError?: () => void;
    protected started: boolean;
    protected finished: boolean;
    protected throwedError: boolean;
    /**
     * @param archive path to archive
     * @param unpackDir directory to extract the files to
     */
    constructor(archive: string, unpackDir?: string | null);
    /**
     * Specify event that will be called when the extraction has started
     *
     * @param callback
     */
    start(callback: () => void): void;
    /**
     * Specify event that will be called every [this.progressInterval] ms while extracting the archive
     *
     * @param callback
     */
    progress(callback: (current: number, total: number, difference: number) => void): void;
    /**
     * Specify event that will be called after the archive has been extracted
     *
     * @param callback
     */
    finish(callback: () => void): void;
    /**
     * Specify event that will be called if archive can't be extracted
     *
     * @param callback
     */
    error(callback: () => void): void;
    /**
     * Close unpacking stream
     */
    close(forced?: boolean): void;
}
export default class Archive {
    protected static streams: Stream[];
    /**
     * Get type of archive
     *
     * @param path path to archive
     * @returns supported archive type or null
     */
    static getType(path: string): ArchiveType | null;
    /**
     * Get archive info
     *
     * @param path path to archive
     * @returns null if the archive has unsupported type. Otherwise - archive info
     */
    static getInfo(path: string): Promise<ArchiveInfo | null>;
    /**
     * Extract Archive
     *
     * @param path path to archive
     * @param unpackDir directory to extract the files to
     */
    static extract(path: string, unpackDir?: string | null): Promise<Stream>;
    /**
     * Close every open archive extracting stream
     */
    static closeStreams(forced?: boolean): void;
}
export { Stream };
export type { ArchiveType, File, Size, ArchiveInfo };
