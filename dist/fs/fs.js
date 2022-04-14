import path from '../paths/path.js';
export default class fs {
    /**
     * Read file
     */
    static read(file, binary = false) {
        return new Promise(async (resolve, reject) => {
            (binary ? Neutralino.filesystem.readBinaryFile(file) : Neutralino.filesystem.readFile(file))
                .then(resolve).catch(reject);
        });
    }
    /**
     * Write file
     */
    static write(file, data) {
        return new Promise((resolve, reject) => {
            (typeof data === 'string' ? Neutralino.filesystem.writeFile(file, data) : Neutralino.filesystem.writeBinaryFile(file, data))
                .then(resolve).catch(reject);
        });
    }
    /**
     * Check if filesystem entry exists
     */
    static exists(path) {
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
    static stats(path) {
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
    static remove(file) {
        return new Promise((resolve, reject) => {
            Neutralino.os.execCommand(`rm -rf "${path.addSlashes(file)}"`)
                .then(() => resolve())
                .catch(reject);
        });
    }
    /**
     * Get list of filesystem entries inside a directory
     */
    static files(path) {
        return new Promise((resolve, reject) => {
            Neutralino.filesystem.readDirectory(path)
                .then((files) => {
                const entries = files
                    .filter((file) => file.entry !== '.' && file.entry !== '..')
                    .map((file) => {
                    return {
                        name: file.entry,
                        type: file.type === 'FILE' ? 'file' : 'directory'
                    };
                });
                resolve(entries);
            })
                .catch(reject);
        });
    }
    /**
     * Create folder
     */
    static mkdir(directory) {
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
    static copy(from, to) {
        return new Promise((resolve, reject) => {
            this.stats(from).then((stats) => {
                if (stats === null)
                    reject(new Error('File or directory doesn\'t exist'));
                else
                    Neutralino.os.execCommand(`cp -r "${path.addSlashes(from)}" "${path.addSlashes(to)}"`)
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
    static move(from, to) {
        return new Promise((resolve, reject) => {
            this.stats(from).then((stats) => {
                if (stats === null)
                    reject(new Error('File or directory doesn\'t exist'));
                else
                    Neutralino.os.execCommand(`mv "${path.addSlashes(from)}" "${path.addSlashes(to)}"`)
                        .then(() => resolve())
                        .catch(reject);
            });
        });
    }
}
;
