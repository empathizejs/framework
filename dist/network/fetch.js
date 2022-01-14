class Response {
    constructor(url, status, length) {
        this.url = url;
        this.status = status;
        this.length = length;
        // https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
        this.ok = status >= 200 && status <= 299;
    }
    /**
     * Get request's body
     *
     * @param delay maximal request delay in milliseconds
     */
    body(delay = null) {
        return new Promise((resolve) => {
            Neutralino.os.execCommand(`curl -s -L ${delay !== null ? `-m ${delay / 1000}` : ''} "${this.url}"`)
                .then((output) => resolve(output.stdOut));
        });
    }
}
/**
 * Fetch data from the URL
 *
 * @param delay maximal request delay in milliseconds
 */
export default function fetch(url, delay = null) {
    return new Promise(async (resolve) => {
        let header = await Neutralino.os.execCommand(`curl -s -I -L ${delay !== null ? `-m ${delay / 1000}` : ''} "${url}"`);
        if (header.stdOut == '')
            header = header.stdErr;
        else
            header = header.stdOut;
        header = header.split(/^HTTP\/[\d\.]+ /mi).pop();
        let status = parseInt(header.split(/\s/).shift());
        let length = /^content-length: ([\d]+)/mi.exec(header);
        if (isNaN(status))
            status = null;
        if (length !== null)
            length = parseInt(length[1]);
        resolve(new Response(url, status, length));
    });
}
;
export { Response };
