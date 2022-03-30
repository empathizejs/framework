import path from '../paths/path.js';
import fs from '../fs/fs.js';
export default class Package {
    /**
     * Check if some binary file or package downloaded
     *
     * This function will check every directory in the $PATH
     * env variable, plus "/usr/share" folder, and check
     * if the {name} file or folder exists there
     */
    static exists(name) {
        return new Promise(async (resolve) => {
            let available = false;
            let paths = (await Neutralino.os.getEnv('PATH')).split(path.delimiter);
            // Add some paths if they're not included
            // because we use these paths to check if some library exists in the system
            paths = paths.concat([
                '/usr/share',
                '/opt'
            ]);
            let pathsMap = {};
            // Remove identical paths by making them the object's keys
            for (const path of paths)
                pathsMap[path] = true;
            // Sort them by length because obviously
            // "/usr/bin" is more important than some randomly generated
            // yaml or npm folder for its globally downloaded packages
            paths = Object.keys(pathsMap).sort((a, b) => a.length - b.length);
            for (const path of paths)
                if (await fs.exists(`${path}/${name}`)) {
                    available = true;
                    break;
                }
            resolve(available);
        });
    }
}
;
