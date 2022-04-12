export default class Package {
    /**
     * Check if some binary file or package downloaded
     *
     * This function will check every directory in the $PATH
     * env variable, plus "/usr/share" folder, and check
     * if the {name} file or folder exists there
     *
     * @param paths - additional paths to search for the package in
     */
    static exists(name: string, paths?: string[]): Promise<boolean>;
}
