import { describe, expect, it } from 'vitest';
import { parse } from '../index';

describe('http methods', () => {
  it('should handle --request option', () => {
    const cmd = parse('curl --request head http://example.com');

    expect(cmd.method).toBe('head');
  });

  it('should handle -X option', () => {
    const cmd = parse('curl -X put http://example.com');

    expect(cmd.method).toBe('put');
  });

  it('should lowercase http method', () => {
    const cmd = parse('curl --request OPTIONS http://example.com');

    expect(cmd.method).toBe('options');
  });

  it('should handle concatenated http method options like -XHEAD', () => {
    const cmd = parse('curl -XHEAD http://example.com');

    expect(cmd.method).toBe('head');
  });
});
