import { parse } from '../index';

describe('crlf', () => {
  it('should handle --crlf option', () => {
    const cmd = parse('curl --crlf http://example.com');

    expect(cmd.flags.crlf).toBe(true);
  });

  it('should handle --no-crlf option', () => {
    const cmd = parse('curl --no-crlf http://example.com');

    expect(cmd.flags.crlf).toBe(false);
  });

  it('should leave crlf undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.flags.crlf).toBeUndefined();
  });
});
