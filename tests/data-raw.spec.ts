import { parse } from '../index';

describe('data-raw', () => {
  it('should handle --data-raw option', () => {
    const cmd = parse('curl --data-raw "hello world" http://example.com');

    expect(cmd.body).toBe('hello world');
    expect(cmd.bodyArg).toBe('raw');
  });

  it('should set method to post when --data-raw is provided', () => {
    const cmd = parse('curl --data-raw "hello" http://example.com');

    expect(cmd.method).toBe('get');
  });

  it('should handle --data-raw with special characters', () => {
    const cmd = parse('curl --data-raw "key=value&foo=bar" http://example.com');

    expect(cmd.body).toBe('key=value&foo=bar');
    expect(cmd.bodyArg).toBe('raw');
  });
});
