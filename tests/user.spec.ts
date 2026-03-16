import { parse } from '../index';

describe('user', () => {
  it('should handle --user option', () => {
    const cmd = parse('curl --user admin:secret http://example.com');

    expect(cmd.user).toBe('admin:secret');
  });

  it('should handle -u option', () => {
    const cmd = parse('curl -u admin:secret http://example.com');

    expect(cmd.user).toBe('admin:secret');
  });

  it('should handle multiple --user arguments', () => {
    const cmd = parse('curl --user foo:bar --user baz:zap http://example.com');

    expect(cmd.user).toBe('baz:zap');
  });

  it('should leave user undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.user).toBeUndefined();
  });
});
