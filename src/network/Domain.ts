import path from '../paths/path';

type DomainInfo = {
    uri: string;
    remoteIp?: string;
    localIp?: string;
    available: boolean;
};

declare const Neutralino;

export default class Domain
{
    public static getInfo(uri: string): Promise<DomainInfo>
    {
        return new Promise(async (resolve) => {
            const process = await Neutralino.os.execCommand(`ping -n -4 -w 1 -B "${path.addSlashes(uri)}"`);
            const output = process.stdOut || process.stdErr;

            if (output.includes('Name or service not known'))
            {
                resolve({
                    uri: uri,
                    available: false
                });
            }

            else
            {
                const regex = /PING (.*) \(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\) .* ([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}) : [\d]+\([\d]+\)/gm.exec(output);

                if (regex !== null)
                {
                    resolve({
                        uri: regex[1],
                        remoteIp: regex[2],
                        localIp: regex[3],
                        available: regex[2] !== regex[3]
                    });
                }
            }
        });
    }
};

export type { DomainInfo };
