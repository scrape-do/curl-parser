import { parse } from '../index';

describe('digest', () => {
  it('should handle --digest option', () => {
    const cmd = parse('curl --digest http://example.com');

    expect(cmd.digest).toBe(true);
  });

  it('should leave digest undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.digest).toBeUndefined();
  });
});
