import promisify from '../async/promisify';
import path from '../paths/path';
class Stream {
    /**
     * @param archive path to archive
     * @param unpackDir directory to extract the files to
     */
    constructor(archive, unpackDir = null) {
        this._id = -1;
        /**
         * The interval in ms between progress event calls
         */
        this.progressInterval = 500;
        this.unpacked = 0;
        this.started = false;
        this.finished = false;
        this.throwedError = false;
        this.path = archive;
        this.unpackDir = unpackDir;
        this.started = true;
        if (this.onStart)
            this.onStart();
        Archive.getInfo(archive).then((info) => {
            if (info === null) {
                this.throwedError = true;
                if (this.onError)
                    this.onError();
            }
            else {
                this.archive = info;
                let command = {
                    tar: `tar -xvf "${path.addSlashes(archive)}"${unpackDir ? ` -C "${path.addSlashes(unpackDir)}"` : ''}`,
                    zip: `unzip -o "${path.addSlashes(archive)}"${unpackDir ? ` -d "${path.addSlashes(unpackDir)}"` : ''}`
                }[this.archive.type];
                if (unpackDir)
                    command = `mkdir -p "${path.addSlashes(unpackDir)}" && ${command}`;
                let remainedFiles = this.archive.files;
                const baseDir = unpackDir ?? NL_CWD;
                Neutralino.os.execCommand(command, {
                    background: true
                }).then((result) => {
                    this._id = result.pid;
                });
                const updateProgress = async () => {
                    let difference = 0;
                    let pool = [];
                    remainedFiles.forEach((file) => {
                        if (file.path != '#unpacked#') {
                            pool.push(() => {
                                return new Promise((resolve) => {
                                    Neutralino.filesystem.getStats(`${baseDir}/${file.path}`)
                                        .then(() => {
                                        this.unpacked += file.size.uncompressed;
                                        difference += file.size.uncompressed;
                                        file.path = '#unpacked#';
                                        resolve();
                                    })
                                        .catch(() => resolve());
                                });
                            });
                        }
                    });
                    await promisify({
                        callbacks: pool,
                        callAtOnce: true,
                        interval: 200
                    });
                    remainedFiles = remainedFiles.filter((file) => file.path != '#unpacked#');
                    if (this.onProgress)
                        this.onProgress(this.unpacked, this.archive.size.uncompressed, difference);
                    if (this.unpacked >= this.archive.size.uncompressed) {
                        this.finished = true;
                        if (this.onFinish)
                            this.onFinish();
                    }
                    if (!this.finished)
                        setTimeout(updateProgress, this.progressInterval);
                };
                setTimeout(updateProgress, this.progressInterval);
            }
        });
    }
    /**
     * ID of the archive unpacker process
     */
    get id() {
        return this._id;
    }
    /**
     * Specify event that will be called when the extraction has started
     *
     * @param callback
     */
    start(callback) {
        this.onStart = callback;
        if (this.started)
            callback();
    }
    /**
     * Specify event that will be called every [this.progressInterval] ms while extracting the archive
     *
     * @param callback
     */
    progress(callback) {
        this.onProgress = callback;
    }
    /**
     * Specify event that will be called after the archive has been extracted
     *
     * @param callback
     */
    finish(callback) {
        this.onFinish = callback;
        if (this.finished)
            callback();
    }
    /**
     * Specify event that will be called if archive can't be extracted
     *
     * @param callback
     */
    error(callback) {
        this.onError = callback;
        if (this.throwedError)
            callback();
    }
    /**
     * Close unpacking stream
     */
    close(forced = false) {
        Neutralino.os.execCommand(`kill ${forced ? '-9' : '-15'} ${this._id}`);
    }
}
export default class Archive {
    /**
     * Get type of archive
     *
     * @param path path to archive
     * @returns supported archive type or null
     */
    static getType(path) {
        if (path.substring(path.length - 4) == '.zip')
            return 'zip';
        else if (path.substring(path.length - 7, path.length - 2) == '.tar.')
            return 'tar';
        else
            return null;
    }
    /**
     * Get archive info
     *
     * @param path path to archive
     * @returns null if the archive has unsupported type. Otherwise - archive info
     */
    static getInfo(path) {
        return new Promise(async (resolve) => {
            let archive = {
                type: this.getType(path),
                size: {
                    compressed: null,
                    uncompressed: null
                },
                files: []
            };
            switch (archive.type) {
                case 'tar':
                    const tarOutput = await Neutralino.os.execCommand(`tar -tvf "${path}"`);
                    for (const match of tarOutput.stdOut.matchAll(/^[dwxr\-]+ [\w/]+[ ]+(\d+) [0-9\-]+ [0-9\:]+ (.+)/gm)) {
                        let fileSize = parseInt(match[1]);
                        archive.size.uncompressed += fileSize;
                        archive.files.push({
                            path: match[2],
                            size: {
                                compressed: null,
                                uncompressed: fileSize
                            }
                        });
                    }
                    resolve(archive);
                    break;
                case 'zip':
                    const zipOutput = await Neutralino.os.execCommand(`unzip -v "${path}"`);
                    for (const match of zipOutput.stdOut.matchAll(/^(\d+)  [a-zA-Z\:]+[ ]+(\d+)[ ]+[0-9\-]+% [0-9\-]+ [0-9\:]+ [a-f0-9]{8}  (.+)/gm)) {
                        let uncompressedSize = parseInt(match[1]), compressedSize = parseInt(match[2]);
                        archive.size.compressed += compressedSize;
                        archive.size.uncompressed += uncompressedSize;
                        archive.files.push({
                            path: match[3],
                            size: {
                                compressed: compressedSize,
                                uncompressed: uncompressedSize
                            }
                        });
                    }
                    resolve(archive);
                    break;
                default:
                    resolve(null);
                    break;
            }
        });
    }
    /**
     * Extract Archive
     *
     * @param path path to archive
     * @param unpackDir directory to extract the files to
     */
    static extract(path, unpackDir = null) {
        return new Promise((resolve) => {
            const stream = new Stream(path, unpackDir);
            this.streams.push(stream);
            resolve(stream);
        });
    }
    /**
     * Close every open archive extracting stream
     */
    static closeStreams(forced = false) {
        this.streams.forEach((stream) => {
            stream.close(forced);
        });
    }
}
Archive.streams = [];
;
export { Stream };
