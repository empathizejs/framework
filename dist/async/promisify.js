/**
 * Make a promise from the provided function(s) and run it(them)
 */
export default function promisify(callback) {
    return new Promise(async (resolve) => {
        // promisify(() => { ... })
        if (typeof callback === 'function')
            resolve(await Promise.resolve(callback()));
        // promisify(new Promise(...))
        else if (typeof callback['then'] === 'function')
            resolve(await callback);
        // promisify({ callbacks: [ ... ] })
        else {
            let outputs = {};
            // @ts-expect-error
            if (callback.callAtOnce) {
                // @ts-expect-error
                let remained = callback.callbacks.length;
                // @ts-expect-error
                for (let i = 0; i < callback.callbacks.length; ++i) // @ts-expect-error
                    promisify(callback.callbacks[i]).then((output) => {
                        outputs[i] = output;
                        --remained;
                    });
                const updater = () => {
                    if (remained > 0) // @ts-expect-error
                        setTimeout(updater, callback.interval ?? 100);
                    else
                        resolve(outputs);
                };
                // @ts-expect-error
                setTimeout(updater, callback.interval ?? 100);
            }
            else {
                // @ts-expect-error
                for (let i = 0; i < callback.callbacks.length; ++i) // @ts-expect-error
                    outputs[i] = await promisify(callback.callbacks[i]);
                resolve(outputs);
            }
        }
    });
}
;
