export default class dir {
    static resolvePath(name) {
        return new Promise(async (resolve) => {
            if (this.dirs[name] === null)
                this.dirs[name] = await Neutralino.os.getPath(name);
            resolve(this.dirs[name]);
        });
    }
    /**
     * System data directory path
     */
    static get data() {
        return this.resolvePath('data');
    }
    /**
     * System documents directory path
     */
    static get documents() {
        return this.resolvePath('documents');
    }
    /**
     * System pictures directory path
     */
    static get pictures() {
        return this.resolvePath('pictures');
    }
    /**
     * System music directory path
     */
    static get music() {
        return this.resolvePath('music');
    }
    /**
     * System video directory path
     */
    static get video() {
        return this.resolvePath('video');
    }
    /**
     * System downloads directory path
     */
    static get downloads() {
        return this.resolvePath('downloads');
    }
}
dir.dirs = {
    temp: null,
    data: null,
    documents: null,
    pictures: null,
    music: null,
    video: null,
    downloads: null
};
/**
 * Current working directory
 */
dir.cwd = NL_CWD;
/**
 * Application path
 */
dir.app = NL_PATH;
/**
 * System temp directory path
 */
dir.temp = '/tmp';
;
