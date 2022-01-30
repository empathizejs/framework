// Paths API
import path from './paths/path.js';
import dir from './paths/dir.js';

// Filesystem API
import fs from './fs/fs.js';

// Windows API
import Windows from './windows/Windows.js';

// OS API
import Process from './os/Process.js';
import Tray from './os/Tray.js';
import IPC from './os/IPC.js';
import Notification from './os/Notification.js';
import Archive from './os/Archive.js';
import Package from './os/Package.js';

// Network API
import fetch from './network/fetch.js';
import Domain from './network/Domain.js';
import Downloader from './network/Downloader.js';

// Async API
import promisify from './async/promisify.js';

// Meta classes
import Cache from './meta/Cache.js';
import Configs from './meta/Configs.js';
import Debug from './meta/Debug.js';

export {
    // Paths API
    path, dir,

    // Filesystem API
    fs,

    // Windows API
    Windows,

    // OS API
    Process, Tray, IPC, Notification, Archive, Package,

    // Network API
    fetch, Domain, Downloader,

    // Async API
    promisify,

    // Meta classes
    Cache, Configs, Debug
};
