import path from '../paths/path';
export default class fs {
    /**
     * Read file
     */
    static read(file, binary = false) {
        return new Promise(async (resolve) => {
            resolve(binary ?
                await Neutralino.filesystem.readBinaryFile(file) :
                await Neutralino.filesystem.readFile(file));
        });
    }
    /**
     * Write file
     */
    static write(file, data) {
        return new Promise((resolve) => {
            if (typeof data === 'string')
                Neutralino.filesystem.writeFile(file, data).then(resolve);
            else
                Neutralino.filesystem.writeBinaryFile(file, data).then(resolve);
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
        return new Promise((resolve) => {
            Neutralino.os.execCommand(`rm -rf "${path.addSlashes(file)}"`)
                .then(() => resolve());
        });
    }
    /**
     * Get list of filesystem entries inside a directory
     */
    static files(path) {
        return new Promise((resolve) => {
            Neutralino.filesystem.readDirectory(path)
                .then((files) => {
                resolve(files.filter((file) => file !== '.' && file !== '..'));
            });
        });
    }
    /**
     * Create folder
     */
    static mkdir(directory) {
        return new Promise((resolve) => {
            Neutralino.os.execCommand(`mkdir -p "${path.addSlashes(directory)}"`)
                .then(() => resolve());
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
                        .then(() => resolve());
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
                        .then(() => resolve());
            });
        });
    }
}
;
