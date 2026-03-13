import { parse } from '../index';

describe('silent', () => {
  it('should handle --silent option', () => {
    const cmd = parse('curl --silent http://example.com');

    expect(cmd.flags.silent).toBe(true);
  });

  it('should handle --no-silent option', () => {
    const cmd = parse('curl --no-silent http://example.com');

    expect(cmd.flags.silent).toBe(false);
  });

  it('should leave silent undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.flags.silent).toBeUndefined();
  });
});
