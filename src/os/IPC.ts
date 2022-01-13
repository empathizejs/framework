import dir from '../paths/dir';

declare const Neutralino;
declare const NL_APPID;

class IPCRecord
{
    public readonly id: number;
    public readonly time: number;
    public readonly data: any;

    public constructor(id: number, time: number, data: any)
    {
        this.id = id;
        this.time = time;
        this.data = data;
    }

    /**
     * Remove the record from the storage
     */
    public pop(): IPCRecord
    {
        IPC.remove(this);

        return this;
    }

    public get(): { id: number; time: number; data: any}
    {
        return {
            id: this.id,
            time: this.time,
            data: this.data
        };
    }
}

export default class IPC
{
    public static readonly file = `${dir.temp}/.${NL_APPID}.ipc.json`;

    /**
     * Read records from the "shared inter-process storage"
     */
    public static read(): Promise<IPCRecord[]>
    {
        return new Promise(async (resolve) => {
            Neutralino.filesystem.readFile(this.file)
                .then((data) => resolve(JSON.parse(data).map((record) => new IPCRecord(record.id, record.time, record.data))))
                .catch(() => resolve([]));
        });
    }

    /**
     * Write some data to the "shared inter-process storage"
     */
    public static write(data: any): Promise<IPCRecord>
    {
        return new Promise(async (resolve) => {
            const records = await this.read();

            const record = new IPCRecord(Math.round(Math.random() * 100000), Date.now(), data);

            records.push(record);

            await Neutralino.filesystem.writeFile(this.file, JSON.stringify(records));

            resolve(record);
        });
    }

    /**
     * Remove record from the "shared inter-process storage"
     */
    public static remove(record: IPCRecord|number): Promise<void>
    {
        return new Promise(async (resolve) => {
            let records = await this.read();

            records = records.filter((item) => {
                return typeof record === 'number' ?
                    item.id !== record :
                    item.id !== record.id || item.time !== record.time;
            });

            await Neutralino.filesystem.writeFile(this.file, JSON.stringify(records));

            resolve();
        });
    }

    /**
     * Remove all the record from the "shared inter-process storage"
     */
    public static purge(): Promise<void>
    {
        return new Promise(async (resolve) => {
            Neutralino.filesystem.removeFile(this.file)
                .then(() => resolve())
                .catch(() => resolve());
        });
    }
};

export { IPCRecord };
