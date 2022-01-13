declare class Response {
    /**
     * Requested url
     */
    readonly url: string;
    /**
     * HTTP status code
     */
    readonly status: number | null;
    /**
     * Content length
     */
    readonly length: number | null;
    /**
     * Represents whether the response was successful (status in the range 200-299) or not
     */
    readonly ok: boolean;
    constructor(url: string, status: number | null, length: number | null);
    /**
     * Get request's body
     *
     * @param delay maximal request delay in milliseconds
     */
    body(delay?: number | null): Promise<string>;
}
/**
 * Fetch data from the URL
 *
 * @param delay maximal request delay in milliseconds
 */
export default function fetch(url: string, delay?: number | null): Promise<Response>;
export { Response };
