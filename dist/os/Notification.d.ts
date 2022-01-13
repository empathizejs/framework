declare type NotificationOptions = {
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
export default class Notification {
    /**
     * Show notification
     */
    static show(options: NotificationOptions): void;
}
export type { NotificationOptions };
