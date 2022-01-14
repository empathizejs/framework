class DebugThread {
    constructor(funcName = null, options = null) {
        // Generate some random thread id
        this.thread = 1000 + Math.round(Math.random() * 8999);
        this.funcName = funcName;
        if (options !== null)
            this.log(options);
    }
    log(options) {
        Debug.log({
            thread: this.thread,
            function: this.funcName ?? '',
            ...(typeof options === 'string' ? { message: options } : options)
        });
    }
}
class Debug {
    static formatTime(time) {
        const prefixTime = (time) => {
            return time < 10 ? `0${time}` : time.toString();
        };
        const date = new Date(time);
        return `${prefixTime(date.getHours())}:${prefixTime(date.getMinutes())}:${prefixTime(date.getSeconds())}.${date.getMilliseconds()}`;
    }
    static log(options) {
        const time = Date.now();
        let output = {
            time: time,
            log: [
                `[${this.formatTime(time)}]`
            ]
        };
        if (typeof options === 'string')
            output.log[0] += ` ${options}`;
        else {
            // Add thread id
            if (options.thread)
                output.log[0] += `[thread: ${options.thread}]`;
            // Add function name
            if (options.function)
                output.log[0] += `[${options.function}]`;
            // Add log message if it is a single line
            if (typeof options.message === 'string')
                output.log[0] += ` ${options.message}`;
            // message: [a, b, c, d]
            else if (Array.isArray(options.message))
                options.message.forEach((line) => {
                    if (line !== '')
                        output.log.push(` - ${line}`);
                });
            // message: { a: b, c: d }
            else
                Object.keys(options.message).forEach((key) => {
                    output.log.push(` - [${key}] ${options.message[key]}`);
                });
        }
        console.log(output.log.join('\r\n'));
        this.logOutput.push(output);
        if (this.onLogHandler)
            this.onLogHandler(output);
    }
    static merge(records) {
        this.logOutput.unshift(...records);
        this.logOutput.sort((a, b) => a.time - b.time);
    }
    static getRecords() {
        return this.logOutput;
    }
    static get() {
        let output = [];
        this.logOutput.forEach((record) => {
            record.log.forEach((line) => output.push(line));
        });
        return output;
    }
    static handler(handler) {
        this.onLogHandler = handler;
    }
    /**
     * Convert function to loggable function
     */
    static loggable(func, options) {
        return (...args) => {
            let thread;
            if (options)
                thread = new DebugThread(options.function ?? null, options.start ? options.start(...args) : null);
            const output = options && options.context ?
                func.apply(options.context, args) : func(...args);
            if (typeof output === 'object' && typeof output['then'] === 'function') {
                return new Promise((resolve, reject) => {
                    output['then']((output) => {
                        if (options && options.finish)
                            thread.log(options.finish(output));
                        resolve(output);
                    })
                        .catch((err) => {
                        if (options && options.error)
                            thread.log(options.error(err));
                        reject(err);
                    });
                });
            }
            else {
                if (options && options.finish)
                    thread.log(options.finish(output));
                return output;
            }
        };
    }
}
// Can be useful, for example, to generate log file name
Debug.startedAt = new Date;
Debug.logOutput = [];
export default Debug;
export { DebugThread };
