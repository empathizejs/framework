import path from '../paths/path';
import fetch from '../network/fetch';
class Stream {
    constructor(uri, output, total) {
        this._id = -1;
        /**
         * The interval in ms between progress event calls
         */
        this.progressInterval = 200;
        /**
         * The interval in ms between checking was downloading resumed after pausing
         */
        this.pauseInterval = 500;
        this.previous = 0;
        this.started = false;
        this.paused = true; // true because we call .resume() method at start
        this.finished = false;
        this.uri = uri;
        this.output = output;
        this.total = total;
        this.started = true;
        if (this.onStart)
            this.onStart();
        this.resume();
        const updateProgress = () => {
            if (!this.paused) {
                Neutralino.filesystem.getStats(output).then((stats) => {
                    if (this.onProgress)
                        this.onProgress(stats.size, this.total, stats.size - this.previous);
                    this.previous = stats.size;
                    if (stats.size >= this.total) {
                        this.finished = true;
                        if (this.onFinish)
                            this.onFinish();
                    }
                    if (!this.finished)
                        setTimeout(updateProgress, this.progressInterval);
                }).catch(() => {
                    if (!this.finished)
                        setTimeout(updateProgress, this.progressInterval);
                });
            }
            else
                setTimeout(updateProgress, this.pauseInterval);
        };
        setTimeout(updateProgress, this.progressInterval);
    }
    /**
     * ID of the curl process
     */
    get id() {
        return this._id;
    }
    /**
     * Specify event that will be called when the download gets started
     *
     * @param callback
     */
    start(callback) {
        this.onStart = callback;
        if (this.started)
            callback();
    }
    /**
     * Specify event that will be called every [this.progressInterval] ms while the file is downloading
     *
     * @param callback
     */
    progress(callback) {
        this.onProgress = callback;
    }
    /**
     * Specify event that will be called after the file is downloaded
     *
     * @param callback
     */
    finish(callback) {
        this.onFinish = callback;
        if (this.finished)
            callback();
    }
    /**
     * Pause downloading
     */
    pause() {
        if (!this.paused) {
            this.close(true);
            this.paused = true;
        }
    }
    /**
     * Resume downloading
     */
    resume() {
        if (this.paused) {
            const command = `curl -s -L -N -C - -o "${path.addSlashes(this.output)}" "${this.uri}"`;
            Neutralino.os.execCommand(command, {
                background: true
            }).then((result) => {
                this._id = result.pid;
            });
            this.paused = false;
        }
    }
    /**
     * Close downloading stream
     */
    close(forced = false) {
        Neutralino.os.execCommand(`kill ${forced ? '-9' : '-15'} ${this._id}`);
    }
}
export default class Downloader {
    /**
     * Download file
     *
     * @param uri file's uri to download
     * @param output relative or absolute path to the file to save it as
     *
     * @returns downloading stream
     */
    static async download(uri, output = null) {
        return new Promise(async (resolve) => {
            fetch(uri).then((response) => {
                const stream = new Stream(uri, output ?? this.fileFromUri(uri), response.length);
                this.streams.push(stream);
                resolve(stream);
            });
        });
    }
    /**
     * Get a file name from the URI
     */
    static fileFromUri(uri) {
        const file = uri.split('/').pop().split('#')[0].split('?')[0];
        if (file === '')
            return 'index.html';
        else if (`https://${file}` != uri && `http://${file}` != uri)
            return file;
        else
            return 'index.html';
    }
    /**
     * Close every open downloading stream
     */
    static closeStreams(forced = false) {
        this.streams.forEach((stream) => {
            stream.close(forced);
        });
    }
}
Downloader.streams = [];
;
export { Stream };
