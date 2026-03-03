/**
 * Curl Command Parser / Serializer
 *
 * The aim of this module is NOT to be fully compliant with curl, thus,
 * only subset of the curl options are supported.
 * The currently supported options are listed in `curlOptions`.
 *
 * See: https://man7.org/linux/man-pages/man1/curl.1.html
 */
import { escape, split } from './shellwords';

class CurlOption {
  constructor(
    /** short version of the option  */
    public short: string | null,
    /** long version of the option  */
    public long: string | null,
    /** whether this option expects an argument or not  */
    public expectsValue: boolean,
    /** the corresponding flag of this option  */
    public flag: keyof CurlCommandFlags | null = null,
  ) {}
}

const curlOptions: CurlOption[] = [
  new CurlOption(null, 'anyauth', false, 'anyauth'),
  new CurlOption('b', 'cookie', true),
  new CurlOption(null, 'basic', false, 'basic'),
  new CurlOption(null, 'compressed', false, 'compressed'),
  new CurlOption(null, 'crlf', false, 'crlf'),
  new CurlOption(null, 'compressed-ssh', false, 'compressedSsh'),
  new CurlOption('d', 'data', true),
  new CurlOption(null, 'data-ascii', true),
  new CurlOption(null, 'data-binary', true),
  new CurlOption(null, 'data-raw', true),
  new CurlOption(null, 'data-urlencode', true),
  new CurlOption('f', 'fail', false, 'fail'),
  new CurlOption('g', 'globoff', false, 'globoff'),
  new CurlOption('H', 'header', true),
  new CurlOption('L', 'location', true),
  new CurlOption('S', 'show-error', false, 'showError'),
  new CurlOption('s', 'silent', false, 'silent'),
  new CurlOption('X', 'request', true),
  new CurlOption(null, 'url', true),
];

interface CurlCommandFlags {
  anyauth?: boolean;

  basic?: boolean;

  compressed?: boolean;

  crlf?: boolean;

  compressedSsh?: boolean;

  fail?: boolean;

  globoff?: boolean;

  showError?: boolean;

  silent?: boolean;
}

interface CurlCommand {
  url: string | null;
  headers: { key: string; value: string }[];
  body: string | null;
  /**
   * Which argument was used to pass body..
   * data: -d --data
   * ascii: --data-ascii
   * binary: --data-binary
   * raw: --data-raw
   * urlencode: --data-urlencode
   */
  bodyArg: 'data' | 'ascii' | 'binary' | 'raw' | 'urlencode' | null;
  method: string;
  flags: CurlCommandFlags;
  cookies: string | null;
}

type State = 'command' | 'url-or-arg' | 'argument-value';

export function stringify(cmd: CurlCommand & { url: string }): string {
  const args = ['curl'];

  if (cmd.method.toLowerCase() !== 'get') {
    args.push('-X', cmd.method.toLowerCase());
  }

  for (const header of cmd.headers) {
    args.push('-H', `'${header.key}:${header.value}'`);
  }

  if (cmd.body) {
    args.push('-d', cmd.body);
  }

  args.push(cmd.url);

  return args.map(escape).join(' ');
}

export function parse(command: string): CurlCommand {
  const args = split(command).filter((arg) => arg !== '\\');
  const result: CurlCommand = {
    url: null,
    headers: [],
    body: null,
    bodyArg: null,
    method: 'get',
    flags: {},
    cookies: null,
  };
  let state: State = 'command';
  let currentOpt: CurlOption | null = null;

  for (const arg of args) {
    switch (state) {
      case 'command':
        if (arg !== 'curl') throw new Error(`Invalid command: ${arg}`);
        state = 'url-or-arg';
        break;

      case 'url-or-arg': {
        let curlOpt: CurlOption | undefined;

        if (arg.startsWith('--')) {
          curlOpt = curlOptions.find((opt) => opt.long === arg.slice(2));

          if (!curlOpt) throw new Error(`Unrecognized argumen: ${arg}`);

          // enable the flag
          if (curlOpt.flag) {
            result.flags[curlOpt.flag] = true;
          }
        } else if (arg.startsWith('-')) {
          const flags = arg.slice(1).split('');

          flags.forEach((flag, i) => {
            curlOpt = curlOptions.find((opt) => opt.short === flag);

            if (!curlOpt)
              throw new Error(`Unrecognized option: ${flag} in "${arg}"`);

            const isLast = i === flags.length - 1;

            if (curlOpt.expectsValue && !isLast) {
              throw new Error(
                `Value expecting argument "${flag}" must be the last in ${arg}`,
              );
            }

            // enable the flag
            if (curlOpt.flag) {
              result.flags[curlOpt.flag] = true;
            }
          });
        }

        if (curlOpt) {
          if (curlOpt.expectsValue) {
            state = 'argument-value';
            currentOpt = curlOpt;
          }

          continue;
        }

        if (result.url)
          throw new Error(
            `unrecognized positional argument ${arg}. Url was already set.`,
          );

        result.url = arg;

        break;
      }

      case 'argument-value': {
        switch (currentOpt?.long) {
          case 'cookie':
            result.cookies = arg;
            break;
          case 'data-ascii':
            result.bodyArg = 'ascii';
            result.body = arg;
            break;
          case 'data-binary':
            result.bodyArg = 'binary';
            result.body = arg;
            break;
          case 'data':
            result.bodyArg = 'data';
            result.body = arg;
            break;
          case 'data-raw':
            result.bodyArg = 'raw';
            result.body = arg;
            break;
          case 'data-urlencode': {
            let formatted = arg.replace(/^=/, '');

            if (!formatted.includes('=')) formatted += '=';

            result.bodyArg = 'urlencode';
            result.body =
              result.body === null ? formatted : `${result.body}&${formatted}`;

            break;
          }

          // parse header argument value
          case 'header': {
            const matches = /^([^:]+)(:\s?(.+))?;?$/.exec(arg);

            if (!matches) {
              throw new Error(`Invalid header value: ${arg}`);
            }

            result.headers.push({
              key: matches[1],
              value: matches[3] ?? '',
            });

            break;
          }

          case 'location':
            if (result.url) {
              throw new Error(
                `URL was already set, and an additional --location argument provided with value "${arg}"`,
              );
            }

            result.url = arg;
            break;

          case 'request':
            result.method = arg;
            break;

          case 'url':
            result.url = arg;
            break;

          default:
            throw new Error(`no argument set for option ${currentOpt?.long}`);
        }

        state = 'url-or-arg';
        currentOpt = null;
      }
    }
  }

  return result;
}
