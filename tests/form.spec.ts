import { parse } from '../index';

describe('form', () => {
  it('should handle -F option', () => {
    const cmd = parse('curl -F "name=value" http://example.com');

    expect(cmd.formData).toEqual([{ key: 'name', value: 'value' }]);
  });

  it('should handle --form option', () => {
    const cmd = parse('curl --form "name=value" http://example.com');

    expect(cmd.formData).toEqual([{ key: 'name', value: 'value' }]);
  });

  it('should handle multiple -F options', () => {
    const cmd = parse('curl -F "name=value" -F "file=@photo.jpg" http://example.com');

    expect(cmd.formData).toEqual([
      { key: 'name', value: 'value' },
      { key: 'file', value: '@photo.jpg' },
    ]);
  });

  it('should leave formData undefined when not provided', () => {
    const cmd = parse('curl http://example.com');

    expect(cmd.formData).toBeUndefined();
  });

  it('should handle form value with = in value', () => {
    const cmd = parse('curl -F "key=a=b" http://example.com');

    expect(cmd.formData).toEqual([{ key: 'key', value: 'a=b' }]);
  });
});
