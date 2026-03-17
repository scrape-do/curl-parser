# curl-parser

This module parses `curl` commands into JavaScript objects. That's used in [our playground](https://dashboard.scrape.do/playground?utm_source=npm&utm_medium=package) (You may create a free account to try it out).

### Installation

```sh
npm i -S @scrape-do/curl-parser
```

#### Documentation

Usage:

```ts
import { parse, stringify } from "@scrape-do/curl-parser";

const command = parse(
  "curl -X POST -H x-foo:bar -X baz:zap https://httpbin.org"
);

console.log("serialized:", stringify(command));
```

#### CurlCommand

The object returned by `parse()`:

| Field | Type | Description |
|-------|------|-------------|
| `url` | `string \| null` | The request URL |
| `method` | `string` | Lowercased HTTP method (e.g. `"get"`, `"post"`) |
| `headers` | `{ key: string; value: string }[]` | Request headers from `-H` / `--header` |
| `body` | `string \| null` | Request body from `-d` / `--data` and variants |
| `bodyArg` | `"data" \| "ascii" \| "binary" \| "raw" \| "urlencode" \| null` | Which `--data-*` flag was used to set the body |
| `cookies` | `string \| null` | Cookie string from `-b` / `--cookie` |
| `flags` | `CurlCommandFlags` | Boolean curl flags (see below) |
| `userAgent` | `string?` | Value of `-A` / `--user-agent` |
| `user` | `string?` | Value of `-u` / `--user` |
| `formData` | `{ key: string; value: string }[]?` | Form fields from `-F` / `--form` |

#### CurlCommandFlags

Boolean flags parsed from the curl command:

| Flag | Curl option | Negatable |
|------|-------------|-----------|
| `anyauth` | `--anyauth` | No |
| `basic` | `--basic` | No |
| `compressed` | `--compressed` | Yes (`--no-compressed`) |
| `compressedSsh` | `--compressed-ssh` | Yes |
| `crlf` | `--crlf` | Yes |
| `digest` | `--digest` | Yes |
| `fail` | `-f`, `--fail` | Yes |
| `get` | `-G`, `--get` | Yes |
| `globoff` | `-g`, `--globoff` | Yes |
| `head` | `-I`, `--head` | Yes |
| `insecure` | `-k`, `--insecure` | Yes |
| `ntlm` | `--ntlm` | No |
| `showError` | `-S`, `--show-error` | Yes |
| `silent` | `-s`, `--silent` | Yes |

> **Note:** The tables above may be out of date. Refer to [`index.ts`](./index.ts) for the authoritative definitions of `CurlCommand`, `CurlCommandFlags`, and the supported curl options.

#### Notes

**not** all the curl options are supported, we recognize only a small subset of the commands.
You may refer to `index.ts` to see the currently known curl options by this module. <small>See `const curlOptions: CurlOption[]`</small>

#### Implementation details:

`--data-urlencode`: If this parameter passed multiple times, it just concatenates the arguments with the `&`.  
Consider this example command:

```
curl -X POST --data-urlencode foo=bar --data-urlencode bar=zap https://example.com
```

This would produce this `body`: `foo=bar&bar=zap`
