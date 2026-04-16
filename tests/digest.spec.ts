import { describe, expect, it } from 'vitest';
import { parse } from '../index';

describe('digest', () => {
  it('should handle --digest option', () => {
    const cmd = parse('curl --digest http://example.com');

    expect(cmd.flags.digest).toBe(true);
  });

  it('should handle --no-digest option', () => {
    const cmd = parse('curl --no-digest http://example.com');

    expect(cmd.flags.digest).toBe(false);
  });

  it('should leave digest undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.flags.digest).toBeUndefined();
  });
});
