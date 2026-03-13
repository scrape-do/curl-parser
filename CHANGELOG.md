## [UNRELEASED]

* expose `CurlCommand` interface.
* handle `-A/--user-agent` option, expose `userAgent?: string`
* handle `--compressed` option, expose `compressed?: boolean`
* handle `-k/--insecure` option, expose `insecure?: boolean`
* handle `--digest` option, expose `digest?: boolean`
* handle `--ntlm` option, expose `flags.ntlm?: boolean`
* add support for negating boolean options with `--no-` prefix

## 0.3.2

* always lowercase the http method
* feat: handle short options with concatenated values

## 0.3.1

* added `--url` parameter support
