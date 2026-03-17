import { parse } from '../index';

describe('data-urlencode', () => {
  it('should handle --data-urlencode option', () => {
    const cmd = parse('curl --data-urlencode "key=value" http://example.com');

    expect(cmd.body).toBe('key=value');
    expect(cmd.bodyArg).toBe('urlencode');
  });

  it('should strip leading = from value', () => {
    const cmd = parse('curl --data-urlencode "=hello world" http://example.com');

    expect(cmd.body).toBe('hello world=');
    expect(cmd.bodyArg).toBe('urlencode');
  });

  it('should append = when value has no = sign', () => {
    const cmd = parse('curl --data-urlencode "hello" http://example.com');

    expect(cmd.body).toBe('hello=');
    expect(cmd.bodyArg).toBe('urlencode');
  });

  it('should concatenate multiple --data-urlencode values with &', () => {
    const cmd = parse('curl --data-urlencode "key=value" --data-urlencode "foo=bar" http://example.com');

    expect(cmd.body).toBe('key=value&foo=bar');
    expect(cmd.bodyArg).toBe('urlencode');
  });
});
