declare type ProcessOptions = {
    /**
     * Environment variables
     */
    env?: object;
    /**
     * Current working directory for the running process
     */
    cwd?: string;
    /**
     * Interval between tries to find started process id
     *
     * @default 50
     */
    childInterval?: number;
};
declare class Process {
    /**
     * Process ID
     */
    readonly id: number;
    /**
     * Interval in ms between process status update
     *
     * null if you don't want to update process status
     *
     * @default 200
     */
    runningInterval: number | null;
    /**
     * Interval in ms between process output update
     *
     * null if you don't want to update process output
     *
     * @default 500
     */
    outputInterval: number | null;
    protected outputFile: string | null;
    protected outputOffset: number;
    protected _finished: boolean;
    /**
     * Whether the process was finished
     */
    get finished(): boolean;
    protected onOutput?: (output: string, process: Process) => void;
    protected onFinish?: (process: Process) => void;
    constructor(pid: number, outputFile?: string | null);
    /**
     * Specify callback to run when the process will be finished
     */
    finish(callback: (process: Process) => void): void;
    output(callback: (output: string, process: Process) => void): void;
    /**
     * Kill process
     */
    kill(forced?: boolean): Promise<void>;
    /**
     * Returns whether the process is running
     *
     * This method doesn't call onFinish event
     */
    running(): Promise<boolean>;
    /**
     * Run shell command
     */
    static run(command: string, options?: ProcessOptions): Promise<Process>;
    static kill(id: number, forced?: boolean): Promise<void>;
}
export type { ProcessOptions };
export default Process;
