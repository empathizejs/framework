import path from '../paths/path.js';
import { DebugThread } from '../meta/Debug.js';
export default class Domain {
    static getInfo(uri) {
        const debugThread = new DebugThread('Domain.getInfo', `Getting info about uri: ${uri}`);
        return new Promise(async (resolve) => {
            const process = await Neutralino.os.execCommand(`LANG=en_US-UTF-8 ping -n -4 -w 1 -B "${path.addSlashes(uri)}"`);
            const output = process.stdOut || process.stdErr;
            const resolveInfo = (info) => {
                debugThread.log({ message: info });
                resolve(info);
            };
            if (output.includes('Name or service not known')) {
                resolveInfo({
                    uri: uri,
                    available: false
                });
            }
            else {
                const regex = /PING (.*) \(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\)[^\d]*([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})[^\d]*:[^\d]*[\d]+\([\d]+\)/gm.exec(output);
                if (regex !== null) {
                    resolveInfo({
                        uri: regex[1],
                        remoteIp: regex[2],
                        localIp: regex[3],
                        available: regex[2] !== regex[3]
                    });
                }
            }
        });
    }
}
;
