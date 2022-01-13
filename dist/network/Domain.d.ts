declare type DomainInfo = {
    uri: string;
    remoteIp?: string;
    localIp?: string;
    available: boolean;
};
export default class Domain {
    static getInfo(uri: string): Promise<DomainInfo>;
}
export type { DomainInfo };
