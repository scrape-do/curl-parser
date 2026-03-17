import { parse } from '../index';

describe('data-binary', () => {
  it('should handle --data-binary option', () => {
    const cmd = parse('curl --data-binary "hello world" http://example.com');

    expect(cmd.body).toBe('hello world');
    expect(cmd.bodyArg).toBe('binary');
  });

  it('should handle --data-binary with key=value pairs', () => {
    const cmd = parse('curl --data-binary "key=value&foo=bar" http://example.com');

    expect(cmd.body).toBe('key=value&foo=bar');
    expect(cmd.bodyArg).toBe('binary');
  });
});
