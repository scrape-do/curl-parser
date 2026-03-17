# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Commands

```sh
pnpm test                        # run all tests
pnpm test -- --testPathPattern form  # run a single spec file
pnpm build                       # compile TypeScript to dist/
pnpm typecheck                   # type-check without emitting
pnpm lint                        # lint with Biome (auto-fixes)
pnpm format                      # format with Biome (auto-fixes)
```

## Architecture

The library exposes two functions from `index.ts`: `parse` and `stringify`.

**`parse`** tokenizes the input using `shellwords.ts` (`split`), then walks the token list with a simple state machine (`'command' | 'url-or-arg' | 'argument-value'`). Recognized options are declared in the `curlOptions` array as `CurlOption` instances — adding a new curl flag means adding an entry there and handling it in `handleArgValue`.

**`shellwords.ts`** is a vendored port of the Ruby `shellwords` library. It handles shell quoting/escaping. Do not modify it unless fixing a bug.

**Adding a new curl option:**
1. Add a `CurlOption` entry to `curlOptions` in `index.ts`.
2. If it takes a value, add a `case` in `handleArgValue`.
3. If it's a boolean flag, add it to `CurlCommandFlags` and pass its key as the `flag` parameter.
4. Add a spec file under `tests/` following the existing pattern (e.g., `tests/form.spec.ts`).

Tests live in `tests/*.spec.ts` plus `index.spec.ts` at the root. Each file typically covers one curl option. Jest is configured via `jest.config.ts` to use `ts-jest`, so tests run directly against TypeScript sources without a build step.

> **Note:** Import from `'./index'` in tests (not `'.'`) to ensure Jest uses the TypeScript source rather than the compiled `dist/`.
