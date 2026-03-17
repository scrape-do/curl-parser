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
    /** Allow boolean option to be negated with --no- prefix */
    public allowsNegating = false,
  ) {}
}

const curlOptions: CurlOption[] = [
  new CurlOption(null, 'anyauth', false, 'anyauth'),
  new CurlOption('b', 'cookie', true),
  new CurlOption(null, 'basic', false, 'basic'),
  new CurlOption(null, 'compressed', false, 'compressed', true),
  new CurlOption(null, 'crlf', false, 'crlf', true),
  new CurlOption(null, 'compressed-ssh', false, 'compressedSsh', true),
  new CurlOption('d', 'data', true),
  new CurlOption(null, 'data-ascii', true),
  new CurlOption(null, 'data-binary', true),
  new CurlOption(null, 'data-raw', true),
  new CurlOption(null, 'data-urlencode', true),
  new CurlOption('f', 'fail', false, 'fail', true),
  new CurlOption('g', 'globoff', false, 'globoff', true),
  new CurlOption('H', 'header', true),
  new CurlOption('L', 'location', true),
  new CurlOption('S', 'show-error', false, 'showError', true),
  new CurlOption('s', 'silent', false, 'silent', true),
  new CurlOption('X', 'request', true),
  new CurlOption(null, 'url', true),
  new CurlOption('A', 'user-agent', true),
  new CurlOption('k', 'insecure', false, 'insecure', true),
  new CurlOption(null, 'digest', false, 'digest', true),
  new CurlOption(null, 'ntlm', false, 'ntlm'),
  new CurlOption('G', 'get', false, 'get', true),
  new CurlOption('I', 'head', false, 'head', true),
  new CurlOption('u', 'user', true),
  new CurlOption('F', 'form', true),
];

export interface CurlCommandFlags {
  anyauth?: boolean;

  basic?: boolean;

  compressed?: boolean;

  crlf?: boolean;

  compressedSsh?: boolean;

  fail?: boolean;

  /**
    -g, --globoff
      This option switches off the "URL globbing parser". When
      you set this option, you can specify URLs that contain the
      letters {}[] without having curl itself interpret them.
      Note that these letters are not normal legal URL contents
      but they should be encoded according to the URI standard.

      Providing -g, --globoff multiple times has no extra effect.
      Disable it again with --no-globoff.

      Example:
              curl -g "https://example.com/{[]}}}}"

      See also -K, --config and -q, --disable.
  */
  globoff?: boolean;

  showError?: boolean;

  /**
    -s, --silent
      Silent or quiet mode. Do not show progress meter or error
      messages. Makes Curl mute. It still outputs the data you
      ask for, potentially even to the terminal/stdout unless you
      redirect it.

      Use -S, --show-error in addition to this option to disable
      progress meter but still show error messages.

      Providing -s, --silent multiple times has no extra effect.
      Disable it again with --no-silent.
   */
  silent?: boolean;

  insecure?: boolean;

  /**
    (HTTP) Enables HTTP Digest authentication. This is an
    authentication scheme that prevents the password from being
    sent over the wire in clear text. Use this in combination
    with the normal -u, --user option to set user name and
    password.

    Providing --digest multiple times has no extra effect.
    Disable it again with --no-digest.
   */
  digest?: boolean;

  ntlm?: boolean;

  head?: boolean;

  get?: boolean;
}

export interface CurlCommand {
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

  /**
   * lowercased request method
   */
  method: string;

  /**
   * curl's boolean command-line options
   */
  flags: CurlCommandFlags;

  cookies: string | null;
  userAgent?: string;
  user?: string;
  formData?: { key: string; value: string }[];
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

        if (arg.startsWith('--no-')) {
          curlOpt = curlOptions.find((opt) => opt.long === arg.slice(5));

          if (!curlOpt || !curlOpt.flag)
            throw new Error(`Unrecognized argument: ${arg}`);

          if (!curlOpt.allowsNegating)
            throw new Error(`Option does not support negating: ${arg}`);

          result.flags[curlOpt.flag] = false;
          continue;
        } else if (arg.startsWith('--')) {
          curlOpt = curlOptions.find((opt) => opt.long === arg.slice(2));

          if (!curlOpt) throw new Error(`Unrecognized argument: ${arg}`);

          // enable the flag
          if (curlOpt.flag) {
            result.flags[curlOpt.flag] = true;
          }
        } else if (arg.startsWith('-')) {
          const flags = arg.slice(1).split('');
          let handled = false;

          flags.forEach((flag, i) => {
            if (handled) return;

            curlOpt = curlOptions.find((opt) => opt.short === flag);

            if (!curlOpt)
              throw new Error(`Unrecognized option: ${flag} in "${arg}"`);

            const isFirst = i === 0;

            if (isFirst && curlOpt.expectsValue && arg.length > 2) {
              // handle concatenated values
              currentOpt = curlOpt;
              handleArgValue(arg.slice(2));
              handled = true;
              currentOpt = null;
              return;
            }

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

          if (handled) continue;
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
        handleArgValue(arg);

        state = 'url-or-arg';
        currentOpt = null;
      }
    }
  }

  function handleArgValue(arg: string) {
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
        result.method = arg.toLowerCase();
        break;

      case 'user-agent':
        result.userAgent = arg;
        break;

      case 'user':
        result.user = arg;
        break;

      case 'url':
        result.url = arg;
        break;

      case 'form': {
        const eqIdx = arg.indexOf('=');
        if (eqIdx === -1) throw new Error(`Invalid form value: ${arg}`);

        result.formData = result.formData ?? [];

        result.formData.push({
          key: arg.slice(0, eqIdx),
          value: arg.slice(eqIdx + 1),
        });
        break;
      }

      default:
        throw new Error(`no argument set for option ${currentOpt?.long}`);
    }
  }

  return result;
}
