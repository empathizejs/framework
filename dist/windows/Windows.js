export default class Windows {
    static get current() {
        return {
            ...Neutralino.window,
            center(width, height) {
                return Neutralino.window.move((window.screen.width - (width ?? window.innerWidth)) / 2, (window.screen.height - (height ?? window.innerHeight)) / 2);
            }
        };
    }
    static open(name, options = {}) {
        return new Promise(async (resolve) => {
            const status = await Neutralino.window.create(`/${name}.html`, {
                width: 600,
                height: 400,
                enableInspector: false,
                exitProcessOnClose: true,
                ...options
            });
            resolve({
                status: status !== undefined,
                data: status
            });
        });
    }
}
;
