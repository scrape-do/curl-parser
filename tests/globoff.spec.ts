import { parse } from '../index';

describe('globoff', () => {
  it('should handle -g option', () => {
    const cmd = parse('curl -g http://example.com');

    expect(cmd.flags.globoff).toBe(true);
  });

  it('should handle --globoff option', () => {
    const cmd = parse('curl --globoff http://example.com');

    expect(cmd.flags.globoff).toBe(true);
  });

  it('should handle --no-globoff option', () => {
    const cmd = parse('curl --no-globoff http://example.com');

    expect(cmd.flags.globoff).toBe(false);
  });

  it('should leave globoff undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.flags.globoff).toBeUndefined();
  });
});
