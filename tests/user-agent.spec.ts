import { describe, expect, it } from 'vitest';
import { parse } from '../index';

describe('user-agent', () => {
  it('should handle --user-agent option', () => {
    const cmd = parse('curl --user-agent "Mozilla/5.0" http://example.com');

    expect(cmd.userAgent).toBe('Mozilla/5.0');
  });

  it('should handle -A option', () => {
    const cmd = parse('curl -A "Mozilla/5.0" http://example.com');

    expect(cmd.userAgent).toBe('Mozilla/5.0');
  });

  it('should handle concatenated -A option like -AMyAgent', () => {
    const cmd = parse('curl -AMyAgent http://example.com');

    expect(cmd.userAgent).toBe('MyAgent');
  });

  it('should leave userAgent undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.userAgent).toBeUndefined();
  });
});
