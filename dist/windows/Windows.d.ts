declare type WindowSize = {
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    resizable?: boolean;
};
declare type WindowOptions = WindowSize & {
    title?: string;
    icon?: string;
    fullScreen?: boolean;
    alwaysOnTop?: boolean;
    enableInspector?: boolean;
    borderless?: boolean;
    maximize?: boolean;
    hidden?: boolean;
    maximizable?: boolean;
    exitProcessOnClose?: boolean;
    processArgs?: string;
};
declare type WindowOpenResult = {
    status: boolean;
    data?: {
        pid: number;
        stdOut: string;
        stdErr: string;
        exitCode: number;
    };
};
interface Window {
    /**
     * Set window title
     */
    setTitle(title: string): void;
    /**
     * Get window title
     */
    getTitle(): Promise<string>;
    /**
     * Minimize window
     */
    minimize(): void;
    /**
     * Maximize window
     */
    maximize(): void;
    /**
     * Unmaximize window
     */
    unmaximize(): void;
    /**
     * Check if the window is maximized
     */
    isMaximized(): Promise<boolean>;
    /**
     * Set window to fullscreen
     */
    setFullScreen(): void;
    /**
     * Unset window from fullscreen
     */
    exitFullScreen(): void;
    /**
     * Check if the window is fullscreen
     */
    isFullScreen(): Promise<boolean>;
    /**
     * Show window
     */
    show(): any;
    /**
     * Hide window
     */
    hide(): any;
    /**
     * Check if the window is visible
     */
    isVisible(): Promise<boolean>;
    /**
     * Focus window
     */
    focus(): any;
    /**
     * Set window icon
     */
    setIcon(icon: string): void;
    /**
     * Move window to specified coordinates
     */
    move(x: number, y: number): any;
    /**
     * Set window size
     */
    setSize(size: WindowSize): any;
}
declare class Windows {
    static get current(): Window;
    static open(name: string, options?: WindowOptions): Promise<WindowOpenResult>;
}
export type { WindowSize, WindowOptions, WindowOpenResult, Window };
export default Windows;
