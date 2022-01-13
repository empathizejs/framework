declare type callback = () => any;
declare type PromiseOptions = {
    callbacks: callback[] | Promise<any>[];
    /**
     * If true, then all the callbacks will be called
     * at the same time and promisify will be resolved
     * when all of them have finished
     *
     * Otherwise, callbacks will be called one after the other
     * and promisify will be resolved with the last one
     */
    callAtOnce?: boolean;
    /**
     * [callAtOnce: true] updates interval in ms
     *
     * @default 100
     */
    interval?: number;
};
/**
 * Make a promise from the provided function(s) and run it(them)
 */
export default function promisify(callback: callback | Promise<any> | PromiseOptions): Promise<any>;
export type { PromiseOptions, callback };
