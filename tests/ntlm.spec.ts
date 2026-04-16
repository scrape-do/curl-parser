import { describe, expect, it } from 'vitest';
import { parse } from '../index';

describe('ntlm', () => {
  it('should handle --ntlm option', () => {
    const cmd = parse('curl --ntlm http://example.com');

    expect(cmd.flags.ntlm).toBe(true);
  });

  it('should leave ntlm undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.flags.ntlm).toBeUndefined();
  });
});
