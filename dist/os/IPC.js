import dir from '../paths/dir';
class IPCRecord {
    constructor(id, time, data) {
        this.id = id;
        this.time = time;
        this.data = data;
    }
    /**
     * Remove the record from the storage
     */
    pop() {
        IPC.remove(this);
        return this;
    }
    get() {
        return {
            id: this.id,
            time: this.time,
            data: this.data
        };
    }
}
export default class IPC {
    /**
     * Read records from the "shared inter-process storage"
     */
    static read() {
        return new Promise(async (resolve) => {
            Neutralino.filesystem.readFile(this.file)
                .then((data) => resolve(JSON.parse(data).map((record) => new IPCRecord(record.id, record.time, record.data))))
                .catch(() => resolve([]));
        });
    }
    /**
     * Write some data to the "shared inter-process storage"
     */
    static write(data) {
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
    static remove(record) {
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
    static purge() {
        return new Promise(async (resolve) => {
            Neutralino.filesystem.removeFile(this.file)
                .then(() => resolve())
                .catch(() => resolve());
        });
    }
}
IPC.file = `${dir.temp}/.${NL_APPID}.ipc.json`;
;
export { IPCRecord };
