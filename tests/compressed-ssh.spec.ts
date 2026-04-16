import { describe, expect, it } from 'vitest';
import { parse } from '../index';

describe('compressed-ssh', () => {
  it('should handle --compressed-ssh option', () => {
    const cmd = parse('curl --compressed-ssh http://example.com');

    expect(cmd.flags.compressedSsh).toBe(true);
  });

  it('should handle --no-compressed-ssh option', () => {
    const cmd = parse('curl --no-compressed-ssh http://example.com');

    expect(cmd.flags.compressedSsh).toBe(false);
  });

  it('should leave compressedSsh undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.flags.compressedSsh).toBeUndefined();
  });
});
