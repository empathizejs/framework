import path from '../paths/path';
import dir from '../paths/dir';
import Debug, { DebugThread } from '../meta/Debug';
class Process {
    constructor(pid, outputFile = null) {
        /**
         * Interval in ms between process status update
         *
         * null if you don't want to update process status
         *
         * @default 200
         */
        this.runningInterval = 200;
        /**
         * Interval in ms between process output update
         *
         * null if you don't want to update process output
         *
         * @default 500
         */
        this.outputInterval = 500;
        this.outputOffset = 0;
        this._finished = false;
        this.id = pid;
        this.outputFile = outputFile;
        const debugThread = new DebugThread('Process/Stream', `Opened process ${pid} stream`);
        const updateStatus = () => {
            this.running().then((running) => {
                // The process is still running
                if (running) {
                    if (this.runningInterval)
                        setTimeout(updateStatus, this.runningInterval);
                }
                // Otherwise the process was stopped
                else {
                    this._finished = true;
                    debugThread.log('Process stopped');
                    if (this.onFinish)
                        this.onFinish(this);
                }
            });
        };
        if (this.runningInterval)
            setTimeout(updateStatus, this.runningInterval);
        if (this.outputFile) {
            const updateOutput = () => {
                Neutralino.filesystem.readFile(this.outputFile)
                    .then((output) => {
                    if (this.onOutput)
                        this.onOutput(output.substring(this.outputOffset), this);
                    this.outputOffset = output.length;
                    if (this._finished)
                        Neutralino.filesystem.removeFile(this.outputFile);
                    else if (this.outputInterval)
                        setTimeout(updateOutput, this.outputInterval);
                })
                    .catch(() => {
                    if (this.outputInterval && !this._finished)
                        setTimeout(updateOutput, this.outputInterval);
                });
            };
            if (this.outputInterval)
                setTimeout(updateOutput, this.outputInterval);
        }
    }
    /**
     * Whether the process was finished
     */
    get finished() {
        return this._finished;
    }
    ;
    /**
     * Specify callback to run when the process will be finished
     */
    finish(callback) {
        this.onFinish = callback;
        if (this._finished)
            callback(this);
        // If user stopped process status auto-checking
        // then we should check it manually when this method was called
        else if (this.runningInterval === null) {
            this.running().then((running) => {
                if (!running) {
                    this._finished = true;
                    callback(this);
                }
            });
        }
    }
    output(callback) {
        this.onOutput = callback;
    }
    /**
     * Kill process
     */
    kill(forced = false) {
        Neutralino.filesystem.removeFile(this.outputFile);
        return Process.kill(this.id, forced);
    }
    /**
     * Returns whether the process is running
     *
     * This method doesn't call onFinish event
     */
    running() {
        return new Promise((resolve) => {
            Neutralino.os.execCommand(`ps -p ${this.id} -S`).then((output) => {
                resolve(output.stdOut.includes(this.id) && !output.stdOut.includes('Z   '));
            });
        });
    }
    /**
     * Run shell command
     */
    static run(command, options = {}) {
        return new Promise(async (resolve) => {
            const tmpFile = `${await dir.temp}/${10000 + Math.round(Math.random() * 89999)}.tmp`;
            // Set env variables
            if (options.env)
                for (const key of Object.keys(options.env))
                    command = `${key}="${path.addSlashes(options.env[key].toString())}" ${command}`;
            // Set output redirection to the temp file
            command = `${command} > "${path.addSlashes(tmpFile)}" 2>&1`;
            // Set current working directory
            if (options.cwd)
                command = `cd "${path.addSlashes(options.cwd)}" && ${command}`;
            // And run the command
            const process = await Neutralino.os.execCommand(command, {
                background: true
            });
            const childFinder = async () => {
                const childProcess = await Neutralino.os.execCommand(`pgrep -P ${process.pid}`);
                // Child wasn't found
                if (childProcess.stdOut == '')
                    setTimeout(childFinder, options.childInterval ?? 50);
                // Otherwise return its id
                else {
                    const processId = parseInt(childProcess.stdOut.substring(0, childProcess.stdOut.length - 1));
                    Debug.log({
                        function: 'Process.run',
                        message: {
                            'running command': command,
                            'cwd': options.cwd,
                            'initial process id': process.pid,
                            'real process id': processId,
                            ...options.env
                        }
                    });
                    resolve(new Process(processId, tmpFile));
                }
            };
            setTimeout(childFinder, options.childInterval ?? 50);
        });
    }
    static kill(id, forced = false) {
        return new Promise((resolve) => {
            Neutralino.os.execCommand(`kill ${forced ? '-9' : '-15'} ${id}`).then(() => resolve());
        });
    }
}
export default Process;
