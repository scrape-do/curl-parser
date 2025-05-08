// if we just import ".", typescript
// uses the built version of our library. we want jest to use typescript code directly so we directly import module "./index"
import { parse } from "./index";

describe("curl parser", () => {
  it("should parse basic curl command", () => {
    const command = parse("curl https://example.com");

    expect(command.method).toBe("get");
    expect(command.url).toBe("https://example.com");
  });

  it("should parse multiple flags", () => {
    const command = parse("curl -fsSL https://bun.sh/install");

    expect(command.url).toBe("https://bun.sh/install");
    expect(command.flags.fail).toBe(true);
    expect(command.flags.showError).toBe(true);
    expect(command.flags.silent).toBe(true);
  });

  it("should parse headers", () => {
    const command = parse(
      "curl -H x-foo:bar --header x-baz:zap https://example.com"
    );

    expect(command.headers).toHaveLength(2);
    expect(command.headers).toMatchObject([
      { key: "x-foo", value: "bar" },
      { key: "x-baz", value: "zap" },
    ]);
  });

  it("should parse complex request from chrome developer tools", () => {
    const command = parse(`curl 'https://bun.sh/' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8' \
  -H 'accept-language: en-US,en;q=0.5' \
  -H 'cache-control: max-age=0' \
  -b 'ph_phc=abc' \
  -H 'if-modified-since: Thu, 01 May 2025 19:46:28 GMT' \
  -H 'priority: u=0, i' \
  -H 'sec-ch-ua: "Brave";v="135", "Not-A.Brand";v="8", "Chromium";v="135"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: document' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: none' \
  -H 'sec-fetch-user: ?1' \
  -H 'sec-gpc: 1' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'`);

    expect(command.url).toBe("https://bun.sh/");
    expect(command.cookies).toBe("ph_phc=abc");
    expect(command.headers).toHaveLength(15);
  });

  /**
   * Those are from the curl' manpage.
   */
  it("should parse multiple --data-urlencode options", () => {
    const command = parse(
      "curl --data-urlencode name=val --data-urlencode =encodethis --data-urlencode foo=bar https://example.com"
    );

    expect(command.body).toBe("name=val&encodethis=&foo=bar");
  });
});
