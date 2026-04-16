import { describe, expect, it } from 'vitest';
import { parse } from '../index';

describe('location', () => {
  it('should handle --location option', () => {
    const cmd = parse('curl --location http://example.com');

    expect(cmd.flags.location).toBe(true);
  });

  it('should handle -L short option', () => {
    const cmd = parse('curl -L http://example.com');

    expect(cmd.flags.location).toBe(true);
  });

  it('should handle --no-location option', () => {
    const cmd = parse('curl --no-location http://example.com');

    expect(cmd.flags.location).toBe(false);
  });

  it('should leave location undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.flags.location).toBeUndefined();
  });
});
