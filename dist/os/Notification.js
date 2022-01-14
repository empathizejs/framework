import path from '../paths/path';
export default class Notification {
    /**
     * Show notification
     */
    static show(options) {
        let command = `notify-send "${path.addSlashes(options.title)}" "${path.addSlashes(options.body)}"`;
        // Specify notification icon
        if (options.icon)
            command += ` -i "${path.addSlashes(options.icon)}"`;
        // Specify notification duration
        if (options.duration)
            command += ` -d ${options.duration}`;
        // Specify notification importance
        if (options.importance)
            command += ` -u ${options.importance}`;
        Neutralino.os.execCommand(command, {
            background: true
        });
    }
}
;
