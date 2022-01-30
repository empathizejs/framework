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
            // Add "/usr/share" if it is not included
            // because we use these paths to check if some library exists in system
            if (!paths.includes('/usr/share'))
                paths.push('/usr/share');
            // Sort them by length because obviously
            // "/usr/bin" more important than some randomly generated
            // yaml or npm folder for its globally downloaded packages
            paths = paths.sort((a, b) => a.length - b.length);
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
