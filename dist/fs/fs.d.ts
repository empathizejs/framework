declare type EntryStats = {
    type: 'file' | 'directory';
    size: number;
};
declare type Entry = {
    name: string;
    type: 'file' | 'directory';
};
export default class fs {
    /**
     * Read file
     */
    static read(file: string, binary?: boolean): Promise<string | ArrayBuffer>;
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
    static remove(file: string): Promise<void>;
    /**
     * Get list of filesystem entries inside a directory
     */
    static files(path: string): Promise<Entry[]>;
    /**
     * Create folder
     */
    static mkdir(directory: string): Promise<void>;
    /**
     * Copy file or directory
     *
     * @throws Error if the file or directory doesn't exist
     */
    static copy(from: string, to: string): Promise<void>;
    /**
     * Move file or directory to the new location
     *
     * @throws Error if the file or directory doesn't exist
     */
    static move(from: string, to: string): Promise<void>;
}
export type { EntryStats, Entry };
