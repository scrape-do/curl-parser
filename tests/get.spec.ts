import { parse } from '../index';

describe('get', () => {
  it('should handle -G option', () => {
    const cmd = parse('curl -G http://example.com');

    expect(cmd.flags.get).toBe(true);
  });

  it('should handle --get option', () => {
    const cmd = parse('curl --get http://example.com');

    expect(cmd.flags.get).toBe(true);
  });

  it('should handle --no-get option', () => {
    const cmd = parse('curl --no-get http://example.com');

    expect(cmd.flags.get).toBe(false);
  });

  it('should leave get undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.flags.get).toBeUndefined();
  });
});
