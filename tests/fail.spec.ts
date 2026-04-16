import { describe, expect, it } from 'vitest';
import { parse } from '../index';

describe('fail', () => {
  it('should handle --fail option', () => {
    const cmd = parse('curl --fail http://example.com');

    expect(cmd.flags.fail).toBe(true);
  });

  it('should handle --no-fail option', () => {
    const cmd = parse('curl --no-fail http://example.com');

    expect(cmd.flags.fail).toBe(false);
  });

  it('should leave fail undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.flags.fail).toBeUndefined();
  });
});
