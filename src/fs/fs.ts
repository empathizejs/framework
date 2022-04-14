import path from '../paths/path.js';

type EntryStats = {
    type: 'file' | 'directory';
    size: number;
};

type Entry = {
    name: string;
    type: 'file' | 'directory';
};

declare const Neutralino;

export default class fs
{
    /**
     * Read file
     */
    public static read(file: string, binary: boolean = false): Promise<string|ArrayBuffer>
    {
        return new Promise(async (resolve, reject) => {
            (binary ? Neutralino.filesystem.readBinaryFile(file) : Neutralino.filesystem.readFile(file))
                .then(resolve).catch(reject);
        });
    }

    /**
     * Write file
     */
    public static write(file: string, data: string|ArrayBuffer): Promise<void>
    {
        return new Promise((resolve, reject) => {
            (typeof data === 'string' ? Neutralino.filesystem.writeFile(file, data) : Neutralino.filesystem.writeBinaryFile(file, data))
                .then(resolve).catch(reject);
        });
    }

    /**
     * Check if filesystem entry exists
     */
    public static exists(path: string): Promise<boolean>
    {
        return new Promise((resolve) => {
            Neutralino.filesystem.getStats(path)
                .then(() => resolve(true))
                .catch(() => resolve(false));
        });
    }

    /**
     * Get info about filesystem entry
     * 
     * @return null if the entry doesn't exist
     */
    public static stats(path: string): Promise<EntryStats|null>
    {
        return new Promise((resolve) => {
            Neutralino.filesystem.getStats(path)
                .then((stats) => resolve({
                    type: stats.isFile ? 'file' : 'directory',
                    size: stats.size
                }))
                .catch(() => resolve(null));
        });
    }

    /**
     * Remove file or directory
     */
    public static remove(file: string): Promise<void>
    {
        return new Promise((resolve, reject) => {
            Neutralino.os.execCommand(`rm -rf "${path.addSlashes(file)}"`)
                .then(() => resolve())
                .catch(reject);
        });
    }

    /**
     * Get list of filesystem entries inside a directory
     */
    public static files(path: string): Promise<Entry[]>
    {
        return new Promise((resolve, reject) => {
            Neutralino.filesystem.readDirectory(path)
                .then((files: { entry: string, type: 'FILE' | 'DIRECTORY' }[]) => {
                    const entries: Entry[] = files
                        .filter((file) => file.entry !== '.' && file.entry !== '..')
                        .map((file) => {
                            return {
                                name: file.entry,
                                type: file.type === 'FILE' ? 'file' : 'directory'
                            } as Entry;
                        });

                    resolve(entries);
                })
                .catch(reject);
        });
    }

    /**
     * Create folder
     */
    public static mkdir(directory: string): Promise<void>
    {
        return new Promise((resolve, reject) => {
            Neutralino.os.execCommand(`mkdir -p "${path.addSlashes(directory)}"`)
                .then(() => resolve())
                .catch(reject);
        });
    }

    /**
     * Copy file or directory
     * 
     * @throws Error if the file or directory doesn't exist
     */
    public static copy(from: string, to: string): Promise<void>
    {
        return new Promise((resolve, reject) => {
            this.stats(from).then((stats) => {
                if (stats === null)
                    reject(new Error('File or directory doesn\'t exist'));

                else Neutralino.os.execCommand(`cp -r "${path.addSlashes(from)}" "${path.addSlashes(to)}"`)
                    .then(() => resolve())
                    .catch(reject);
            });
        });
    }

    /**
     * Move file or directory to the new location
     * 
     * @throws Error if the file or directory doesn't exist
     */
    public static move(from: string, to: string): Promise<void>
    {
        return new Promise((resolve, reject) => {
            this.stats(from).then((stats) => {
                if (stats === null)
                    reject(new Error('File or directory doesn\'t exist'));

                else Neutralino.os.execCommand(`mv "${path.addSlashes(from)}" "${path.addSlashes(to)}"`)
                    .then(() => resolve())
                    .catch(reject);
            });
        });
    }
};

export type { EntryStats, Entry };
