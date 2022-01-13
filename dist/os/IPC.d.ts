declare class IPCRecord {
    readonly id: number;
    readonly time: number;
    readonly data: any;
    constructor(id: number, time: number, data: any);
    /**
     * Remove the record from the storage
     */
    pop(): IPCRecord;
    get(): {
        id: number;
        time: number;
        data: any;
    };
}
export default class IPC {
    static readonly file: string;
    /**
     * Read records from the "shared inter-process storage"
     */
    static read(): Promise<IPCRecord[]>;
    /**
     * Write some data to the "shared inter-process storage"
     */
    static write(data: any): Promise<IPCRecord>;
    /**
     * Remove record from the "shared inter-process storage"
     */
    static remove(record: IPCRecord | number): Promise<void>;
    /**
     * Remove all the record from the "shared inter-process storage"
     */
    static purge(): Promise<void>;
}
export { IPCRecord };
