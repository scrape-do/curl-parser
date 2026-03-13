import { parse } from '../index';

describe('insecure', () => {
  it('should handle --insecure option', () => {
    const cmd = parse('curl --insecure http://example.com');

    expect(cmd.insecure).toBe(true);
  });

  it('should handle -k option', () => {
    const cmd = parse('curl -k http://example.com');

    expect(cmd.insecure).toBe(true);
  });

  it('should leave insecure undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.insecure).toBeUndefined();
  });
});
