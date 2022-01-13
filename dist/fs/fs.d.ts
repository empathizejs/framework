declare type ReadOptions = {
    binary?: boolean;
};
declare type EntryStats = {
    type: 'file' | 'directory';
    size: number;
};
export default class fs {
    /**
     * Read file
     */
    static read(file: string, options?: ReadOptions): Promise<string | ArrayBuffer>;
    /**
     * Write file
     */
    static write(file: string, data: string | ArrayBuffer): Promise<void>;
    /**
     * Check if filesystem entry exists
     */
    static exists(path: string): Promise<boolean>;
    /**
     * Get info about filesystem entry
     *
     * @return null if the entry doesn't exist
     */
    static stats(path: string): Promise<EntryStats | null>;
    /**
     * Remove file or directory
     */
    static remove(path: string): Promise<void>;
    /**
     * Get list of filesystem entries inside a directory
     */
    static files(path: string): Promise<string[]>;
    /**
     * Create folder
     */
    static mkdir(path: string): Promise<void>;
    /**
     * Copy file or directory
     *
     * @throws Error if the file or directory doesn't exist
     */
    static copy(path: string, to: string): Promise<void>;
    /**
     * Move file or directory to the new location
     *
     * @throws Error if the file or directory doesn't exist
     */
    static move(path: string, to: string): Promise<void>;
}
export {};
