# curl-parser

This module parses `curl` commands into JavaScript objects. That's used in [our playground](https://dashboard.scrape.do/playground)(You may create a free account to try it out).

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
