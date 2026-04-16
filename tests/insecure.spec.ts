import { describe, expect, it } from 'vitest';
import { parse } from '../index';

describe('insecure', () => {
  it('should handle --insecure option', () => {
    const cmd = parse('curl --insecure http://example.com');

    expect(cmd.flags.insecure).toBe(true);
  });

  it('should handle --no-insecure option', () => {
    const cmd = parse('curl --no-insecure http://example.com');

    expect(cmd.flags.insecure).toBe(false);
  });

  it('should handle -k option', () => {
    const cmd = parse('curl -k http://example.com');

    expect(cmd.flags.insecure).toBe(true);
  });

  it('should leave insecure undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.flags.insecure).toBeUndefined();
  });
});
