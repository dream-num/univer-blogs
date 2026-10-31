import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { blogDestination, forwardingScript, retiredPosts } from "../forwarding.ts";

for (const locale of ["en", "zh"] as const) {
  for (const post of retiredPosts) {
    test(`${locale} forwards ${post.slug} to the matching article`, () => {
      const pathname = `${locale === "zh" ? "/zh" : ""}/posts/${post.slug}/`;
      let destination: string | undefined;
      runInNewContext(forwardingScript, {
        URL,
        location: {
          pathname,
          search: "?utm_source=old",
          hash: "#details",
          replace: (url: string) => {
            destination = url;
          },
        },
      });
      assert.equal(destination, `${blogDestination(locale, post.slug)}?utm_source=old#details`);
    });
  }
}

test("homepages and unknown paths have a safe blog fallback", () => {
  for (const pathname of ["/", "/missing", "/posts/unknown/", "/zh/", "/zh/posts/unknown/"]) {
    let destination: string | undefined;
    runInNewContext(forwardingScript, {
      URL,
      location: {
        pathname,
        search: "",
        hash: "",
        replace: (url: string) => {
          destination = url;
        },
      },
    });
    assert.equal(destination, blogDestination(pathname.startsWith("/zh/") ? "zh" : "en"));
  }
});
