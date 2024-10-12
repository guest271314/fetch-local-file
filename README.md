# fetch-local-file
Fetch local file from arbitrary Web pages using a Web extension

## Synopsis

On arbitrary Web pages from DevTools or other code

```
var file = await fetchLocalFile("/home/user/path/to/fetch-local-file", "../bin/nm_host.js")
  .catch((e) => e);
file;
// Uin8Array (2616) [47, 42, 10, 35, 33, ...]
// Or
// TypeError: Failed to fetch at fetchLocalFile (fetch-local-file.js:26:13)
```

Pass the path to the directory of the unpacked extension as first parameter, and the path to the file to be fetched, relative to the unpacked extension path as second parameter to the function `fetchLocalFile` that is exposed on the Web page by a content script. 

The result of the asynchronous function will either be the file as a `Uint8Array` or the error message from `fetch()`.

## Installation

### Manual

1. Navigate to `chrome://extensions`.
2. Toggle `Developer mode`.
3. Click `Load unpacked`.
4. Select `fetch-local-file` folder.

### Programmatic

```
chrome --load-extension=/absolute/path/to/fetch-local-file
```

## License

Do What the Fuck You Want to Public License [WTFPLv2](http://www.wtfpl.net/about/)
