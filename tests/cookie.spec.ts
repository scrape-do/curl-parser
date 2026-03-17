import { parse } from '../index';

describe('cookie', () => {
  it('should handle --cookie option', () => {
    const cmd = parse('curl --cookie "name=value" http://example.com');

    expect(cmd.cookies).toBe('name=value');
  });

  it('should handle -b option', () => {
    const cmd = parse('curl -b "name=value" http://example.com');

    expect(cmd.cookies).toBe('name=value');
  });

  it('should leave cookies undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.cookies).toBeNull();
  });
});
