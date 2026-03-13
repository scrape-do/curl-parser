import { parse } from '../index';

describe('compressed', () => {
  it('should handle --compressed option', () => {
    const cmd = parse('curl --compressed http://example.com');

    expect(cmd.compressed).toBe(true);
  });

  it('should leave compressed undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.compressed).toBeUndefined();
  });
});
