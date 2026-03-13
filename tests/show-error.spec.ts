import { parse } from '../index';

describe('show-error', () => {
  it('should handle --show-error option', () => {
    const cmd = parse('curl --show-error http://example.com');

    expect(cmd.flags.showError).toBe(true);
  });

  it('should handle --no-show-error option', () => {
    const cmd = parse('curl --no-show-error http://example.com');

    expect(cmd.flags.showError).toBe(false);
  });

  it('should leave show-error undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.flags.showError).toBeUndefined();
  });
});
