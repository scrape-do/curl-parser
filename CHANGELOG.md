## [UNRELEASED]

## 0.4.1

* [fix and feature]: Add support for -L/--location flag as a boolean (flags.location?: boolean) with --no-location negation, correcting prior misparsing as a URL argument.

## 0.4.0

* expose `CurlCommand` and `CurlCommandFlags` interfaces.
* handle `-A/--user-agent` option, expose `userAgent?: string`
* handle `--compressed` option, expose `flags.compressed?: boolean`
* handle `-k/--insecure` option, expose `flags.insecure?: boolean`
* handle `--digest` option, expose `flags.digest?: boolean`
* handle `--ntlm` option, expose `flags.ntlm?: boolean`
* add support for negating boolean options with `--no-` prefix
* handle `-I/--head` option, expose `flags.head?: boolean`
* handle `-u/--user` option, expose `user?: string`
* handle `-G/--get` option, expose `flags.get?: boolean`
* handle `-F/--form` option, expose `formData?: boolean`

## 0.3.2

* always lowercase the http method
* feat: handle short options with concatenated values

## 0.3.1

* added `--url` parameter support
