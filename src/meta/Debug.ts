type DebugOptions = {
    /**
     * Some random-generated thread id
     */
    thread?: number;

    /**
     * Some function name
     */
    function?: string;

    /**
     * Some log message
     */
    message: string|string[]|object;
};

type LogRecord = {
    time: number;
    log: string[];
};

type LoggableOptions = {
    function?: string;
    context?: unknown;
    start?: (thread: DebugThread, ...args) => DebugOptions|string|{ args: any[], options: DebugOptions|string };
    finish?: (thread: DebugThread, output) => DebugOptions|string|{ output: any, options: DebugOptions|string };
    error?: (thread: DebugThread, error) => DebugOptions|string|{ error: any, options: DebugOptions|string };
};

class DebugThread
{
    public storage: any;
    
    protected thread: number;
    protected funcName: string|null;

    public constructor(funcName: string|null = null, options: DebugOptions|string|null = null)
    {
        // Generate some random thread id
        this.thread = 1000 + Math.round(Math.random() * 8999);

        this.funcName = funcName;

        if (options !== null)
            this.log(options);
    }

    public log(options: DebugOptions|string)
    {
        Debug.log({
            thread: this.thread,
            function: this.funcName ?? '',

            ...(typeof options === 'string' ? { message: options } : options)
        });
    }
}

class Debug
{
    // Can be useful, for example, to generate log file name
    public static readonly startedAt = new Date;
    
    protected static logOutput: LogRecord[] = [];

    protected static onLogHandler?: (record: LogRecord) => void;
    
    protected static formatTime(time: number): string
    {
        const prefixTime = (time: number): string => {
            return time < 10 ? `0${time}` : time.toString();
        };

        const date = new Date(time);

        return `${prefixTime(date.getHours())}:${prefixTime(date.getMinutes())}:${prefixTime(date.getSeconds())}.${date.getMilliseconds()}`;
    }

    public static log(options: DebugOptions|string)
    {
        const time = Date.now();

        let output: LogRecord = {
            time: time,
            log: [
                `[${this.formatTime(time)}]`
            ]
        };

        if (typeof options === 'string')
            output.log[0] += ` ${options}`;

        else
        {
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
            else Object.keys(options.message).forEach((key) => {
                output.log.push(` - [${key}] ${options.message[key]}`);
            });
        }

        console.log(output.log.join('\r\n'));

        this.logOutput.push(output);

        if (this.onLogHandler)
            this.onLogHandler(output);
    }

    public static merge(records: LogRecord[])
    {
        this.logOutput.unshift(...records);
        this.logOutput.sort((a, b) => a.time - b.time);
    }

    public static getRecords(): LogRecord[]
    {
        return this.logOutput;
    }

    public static get(): string[]
    {
        let output: string[] = [];

        this.logOutput.forEach((record) => {
            record.log.forEach((line) => output.push(line));
        });

        return output;
    }

    public static handler(handler: (record: LogRecord) => void)
    {
        this.onLogHandler = handler;
    }

    /**
     * Convert function to loggable function
     */
    public static loggable<T extends any>(func: (...args) => T, options?: LoggableOptions): (...args) => T
    {
        return (...args): T => {
            let thread;

            if (options)
            {
                const startOptions = options.start ?
                    options.start(thread, ...args) : null;

                if (startOptions === null)
                    thread = new DebugThread(options.function ?? null);

                else
                {
                    if (typeof startOptions === 'object' && startOptions['options'] !== undefined)
                    {
                        args = options['args'];

                        thread = new DebugThread(options.function ?? null, startOptions['options']);
                    }

                    // @ts-expect-error
                    else thread = new DebugThread(options.function ?? null, startOptions);
                }
            }

            let output = options && options.context ?
                func.apply(options.context, args) : func(...args);
            
            if (typeof output === 'object' && typeof output['then'] === 'function')
            {
                return new Promise((resolve, reject) => {
                    output['then']((output) => {
                        if (options && options.finish)
                        {
                            const finishOutput = options.finish(thread, output);

                            if (typeof finishOutput === 'object' && finishOutput['options'] !== undefined)
                            {
                                output = options['output'];

                                thread.log(finishOutput['options']);
                            }

                            else thread.log(finishOutput);
                        }

                        resolve(output);
                    })
                    .catch((error) => {
                        if (options && options.error)
                        {
                            const errorOutput = options.error(thread, error);

                            if (typeof errorOutput === 'object' && errorOutput['options'] !== undefined)
                            {
                                error = options['error'];

                                thread.log(errorOutput['options']);
                            }

                            else thread.log(errorOutput);
                        }

                        reject(error);
                    });
                }) as T;
            }

            else
            {
                if (options && options.finish)
                {
                    const finishOutput = options.finish(thread, output);

                    if (typeof finishOutput === 'object' && finishOutput['options'] !== undefined)
                    {
                        output = options['output'];

                        thread.log(finishOutput['options']);
                    }

                    else thread.log(finishOutput);
                }
                
                return output;
            }
        };
    }
}

export default Debug;

export { DebugThread };

export type {
    DebugOptions,
    LogRecord
};
