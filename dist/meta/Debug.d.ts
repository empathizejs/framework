declare type DebugOptions = {
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
    message: string | string[] | object;
};
declare type LogRecord = {
    time: number;
    log: string[];
};
declare type LoggableOptions = {
    function?: string;
    context?: unknown;
    start?: (thread: DebugThread, ...args: any[]) => DebugOptions | string;
    finish?: (thread: DebugThread, output: any) => DebugOptions | string;
    error?: (thread: DebugThread, err: any) => DebugOptions | string;
};
declare class DebugThread {
    protected thread: number;
    protected funcName: string | null;
    constructor(funcName?: string | null, options?: DebugOptions | string | null);
    log(options: DebugOptions | string): void;
}
declare class Debug {
    static readonly startedAt: Date;
    protected static logOutput: LogRecord[];
    protected static onLogHandler?: (record: LogRecord) => void;
    protected static formatTime(time: number): string;
    static log(options: DebugOptions | string): void;
    static merge(records: LogRecord[]): void;
    static getRecords(): LogRecord[];
    static get(): string[];
    static handler(handler: (record: LogRecord) => void): void;
    /**
     * Convert function to loggable function
     */
    static loggable<T extends any>(func: (...args: any[]) => T, options?: LoggableOptions): (...args: any[]) => T;
}
export default Debug;
export { DebugThread };
export type { DebugOptions, LogRecord };
