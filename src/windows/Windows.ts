type WindowSize = {
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    resizable?: boolean;
}

type WindowOptions = WindowSize & {
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
}

type WindowOpenResult = {
    status: boolean;
    data?: {
        pid: number;
        stdOut: string;
        stdErr: string;
        exitCode: number;
    };
}

interface Window
{
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
    show();
    
    /**
     * Hide window
     */
    hide();

    /**
     * Check if the window is visible
     */
    isVisible(): Promise<boolean>;

    /**
     * Focus window
     */
    focus();

    /**
     * Set window icon
     */
    setIcon(icon: string): void;

    /**
     * Move window to specified coordinates
     */
    move(x: number, y: number);

    /**
     * Set window size
     */
    setSize(size: WindowSize);
}

declare const Neutralino;

class Windows
{
    public static get current(): Window
    {
        return Neutralino.window;
    }

    public static open(name: string, options: WindowOptions = {}): Promise<WindowOpenResult>
    {
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

export type {
    WindowSize,
    WindowOptions,
    WindowOpenResult,
    Window
};

export default Windows;
