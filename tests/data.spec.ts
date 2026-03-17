import { parse } from '../index';

describe('data', () => {
  it('should handle --data option', () => {
    const cmd = parse('curl --data "hello world" http://example.com');

    expect(cmd.body).toBe('hello world');
    expect(cmd.bodyArg).toBe('data');
  });

  it('should handle -d shorthand', () => {
    const cmd = parse('curl -d "hello world" http://example.com');

    expect(cmd.body).toBe('hello world');
    expect(cmd.bodyArg).toBe('data');
  });

  it('should handle --data with key=value pairs', () => {
    const cmd = parse('curl --data "key=value&foo=bar" http://example.com');

    expect(cmd.body).toBe('key=value&foo=bar');
    expect(cmd.bodyArg).toBe('data');
  });
});
