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
    setTitle(title: string): Promise<void>;
    /**
     * Get window title
     */
    getTitle(): Promise<string>;
    /**
     * Minimize window
     */
    minimize(): Promise<void>;
    /**
     * Maximize window
     */
    maximize(): Promise<void>;
    /**
     * Unmaximize window
     */
    unmaximize(): Promise<void>;
    /**
     * Check if the window is maximized
     */
    isMaximized(): Promise<boolean>;
    /**
     * Set window to fullscreen
     */
    setFullScreen(): Promise<void>;
    /**
     * Unset window from fullscreen
     */
    exitFullScreen(): Promise<void>;
    /**
     * Check if the window is fullscreen
     */
    isFullScreen(): Promise<boolean>;
    /**
     * Show window
     */
    show(): Promise<void>;
    /**
     * Hide window
     */
    hide(): Promise<void>;
    /**
     * Check if the window is visible
     */
    isVisible(): Promise<boolean>;
    /**
     * Focus window
     */
    focus(): Promise<void>;
    /**
     * Set window icon
     */
    setIcon(icon: string): Promise<void>;
    /**
     * Move window to specified coordinates
     */
    move(x: number, y: number): Promise<void>;
    /**
     * Set window size
     */
    setSize(size: WindowSize): Promise<void>;
}
declare class Windows {
    static get current(): Window;
    static open(name: string, options?: WindowOptions): Promise<WindowOpenResult>;
}
export type { WindowSize, WindowOptions, WindowOpenResult, Window };
export default Windows;
