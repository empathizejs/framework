import path from '../paths/path';

type NotificationOptions = {
    /**
     * Notification title
     */
    title: string;

    /**
     * Notification body
     */
    body: string;

    /**
     * Icon name or path
     */
    icon?: string;

    /**
     * Number of seconds this notification
     * will be visible
     */
    duration?: number;

    /**
     * Importance of the notification
     * 
     * @default "normal"
     */
    importance?: 'low' | 'normal' | 'critical';
};

declare const Neutralino;

export default class Notification
{
    /**
     * Show notification
     */
    public static show(options: NotificationOptions)
    {
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
};

export type { NotificationOptions };
