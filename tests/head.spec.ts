import { parse } from '../index';

describe('head', () => {
  it('should handle --head option', () => {
    const cmd = parse('curl --head http://example.com');

    expect(cmd.flags.head).toBe(true);
  });

  it('should handle -I option', () => {
    const cmd = parse('curl -I http://example.com');

    expect(cmd.flags.head).toBe(true);
  });

  it('should handle --no-head option', () => {
    const cmd = parse('curl --no-head http://example.com');

    expect(cmd.flags.head).toBe(false);
  });

  it('should leave head undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.flags.head).toBeUndefined();
  });
});
