import path from '../paths/path.js';
import fs from '../fs/fs.js';

declare const Neutralino;

export default class Package
{
    /**
     * Check if some binary file or package downloaded
     * 
     * This function will check every directory in the $PATH
     * env variable, plus "/usr/share" folder, and check
     * if the {name} file or folder exists there
     * 
     * @param paths - additional paths to search for the package in
     */
    public static exists(name: string, paths: string[] = []): Promise<boolean>
    {
        return new Promise(async (resolve) => {
            let available = false;

            let env_paths: string[] = (await Neutralino.os.getEnv('PATH')).split(path.delimiter);

            // Add some paths if they're not included
            // because we use these paths to check if some library exists in the system
            paths = env_paths.concat([
                '/usr/share',
                '/opt',
                '/app', // Flatpak support
                ...paths
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
                if (await fs.exists(`${path}/${name}`))
                {
                    available = true;

                    break;
                }

            resolve(available);
        });
    }
};
