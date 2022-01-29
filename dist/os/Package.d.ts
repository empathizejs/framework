export default class Package {
    /**
     * Check if some binary file or package downloaded
     *
     * This function will check every directory in the $PATH
     * env variable, plus "/usr/share" folder, and check
     * if the {name} file or folder exists there
     */
    static exists(name: string): Promise<boolean>;
}
