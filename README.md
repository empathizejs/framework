<h1 align="center">Empathize - A Neutralino Framework</h1>

Empathize is a framework for [Neutralino](https://neutralino.js.org) - lightweight and portable desktop application development framework similar to Electron

Empathize adds some useful functions which can help in the development of your application

[Documentation](https://krypt0nn.gitbook.io/empathize)

## Examples

### Fetch computer's IP

```ts
import { fetch } from '@empathize/framework';

// https://ipinfo.io/developers
fetch('https://ipinfo.io').then((response) => {
    if (response.ok)
    {
        console.log(`OK: ${response.status}`);
        
        response.body().then((body) => {
            console.log(`Your IP: ${JSON.parse(body).ip}`);
        });
    }
    
    else console.log(`Error: ${response.status}`);
});
```

### Download and unpack an archive

```ts
import { Downloader, Archive } from '@empathize/framework';

Downloader.download('https://example.com/archive.zip', 'tmp.zip').then((stream) => {
    stream.progressInterval = 1000;

    stream.start(() => {
        console.log('Downloading started');
    });

    stream.start((current, total) => {
        console.log(`Downloading progress: ${Math.round(current / total * 100)}%`);
    });

    stream.finish(() => {
        console.log('Downloading finished');

        Archive.extract('tmp.zip', 'my_folder').then((stream) => {
            stream.start(() => {
                console.log('Unpacking started');
            });

            stream.start((current, total) => {
                console.log(`Unpacking progress: ${Math.round(current / total * 100)}%`);
            });

            stream.finish(() => {
                console.log('Unpacking finished');
            });
        });
    });
});
```

### Store something in config file

```ts
import { Configs, promisify } from '@empathize/framework';

promisify(async () => {
    // Save default values
    await Configs.defaults({
        default: {
            value_1: 1,
            value_2: {
                value_3: 3
            }
        },
        example: [1, 2, 3]
    });

    // Prints 3
    console.log(await Configs.get('default.value_2.value_3'));
});
```

### Cache some data

```ts
import { Cache, promisify } from '@empathize/framework';

promisify(async () => {
    // Save this for 10 seconds
    await Cache.set('example', 'some important data', 10);

    // Cache expired: false
    console.log(`Cache expired: ${(await Cache.get('example')).expired}`);

    // After 10 seconds
    setTimeout(() => {
        // Cache expired: true
        console.log(`Cache expired: ${(await Cache.get('example')).expired}`);
    }, 10000);
});
```

And so on

<br>

Author: [Nikita Podvirnyy](https://vk.com/technomindlp)

Licensed under [GNU GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)
