import { parse } from '../index';

describe('data-ascii', () => {
  it('should handle --data-ascii option', () => {
    const cmd = parse('curl --data-ascii "hello world" http://example.com');

    expect(cmd.body).toBe('hello world');
    expect(cmd.bodyArg).toBe('ascii');
  });

  it('should handle --data-ascii with key=value pairs', () => {
    const cmd = parse('curl --data-ascii "key=value&foo=bar" http://example.com');

    expect(cmd.body).toBe('key=value&foo=bar');
    expect(cmd.bodyArg).toBe('ascii');
  });
});
