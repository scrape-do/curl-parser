import { describe, expect, it } from 'vitest';
import { parse } from '../index';

describe('data-raw', () => {
  it('should handle --data-raw option', () => {
    const cmd = parse('curl --data-raw "hello world" http://example.com');

    expect(cmd.body).toBe('hello world');
    expect(cmd.bodyArg).toBe('raw');
  });

  it('should set method to post when --data-raw is provided', () => {
    const cmd = parse('curl --data-raw "hello" http://example.com');

    expect(cmd.method).toBe('get');
  });

  it('should handle --data-raw with special characters', () => {
    const cmd = parse('curl --data-raw "key=value&foo=bar" http://example.com');

    expect(cmd.body).toBe('key=value&foo=bar');
    expect(cmd.bodyArg).toBe('raw');
  });

  it('should handle --data-raw with stringified json', () => {
    const raw = JSON.stringify({
      foo: 'bar',
      key: JSON.stringify([{ foo: 'bar' }]),
    });

    // please note that single quote is used instead of the double quotes.
    // double quotes allow variable substitution ("$foo" will translated to something like "foobar" or "" if the $foo is not defined)
    const cmd = parse(`curl --data-raw '${raw}' http://example.com`);

    expect(cmd.body).toBe(raw);
    expect(cmd.bodyArg).toBe('raw');
  });
});
