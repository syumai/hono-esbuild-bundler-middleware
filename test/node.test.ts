import { Hono } from "hono";
import { describe, it, expect } from "vitest";
import { esbuildBundler } from "../src/bundlers/node";
import { serveStatic } from "@hono/node-server/serve-static";
import { resolve } from "path";

const TS = "function add(a: number, b: number) { return a + b; }";
const BAD = "function { !!! !@#$ add(a: INT) return a + b + c; }";

// No Whitespace
// Returns a code representation where every space chain has been collapsed
// Needed because different bundler may produce different whitespace
function nw(code: string) {
  return code.replace(/\s+/g, " ").trim();
}

describe("esbuild Bundler middleware", () => {
  const app = new Hono();

  app.use(
    "/static/*",
    esbuildBundler({
      root: resolve(process.cwd(), "testdata"),
    })
  );

  app.use("/static/*", serveStatic({ root: "testdata" }));

  it("Should bundle typescript", async () => {
    // Request a Typescript page
    const res = await app.request("http://localhost/static/file.ts");
    expect(res).not.toBeNull();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/javascript");
    expect(nw(await res.text())).toBe(`"use strict"; (() => { })();`);
  });

  it("Should not touch non TS content paths", async () => {
    // Request a Typescript page
    const res = await app.request("http://localhost/static/file.js");
    expect(res).not.toBeNull();
    expect(res.status).toBe(200);
    expect(nw(await res.text())).toBe(TS);
  });

  it("Should not meddle with with badly formed TS", async () => {
    const res = await app.request("http://localhost/static/bad.ts");
    expect(res).not.toBeNull();
    expect(res.status).toBe(500);
    expect(res.headers.get("content-type")).toBe("text/javascript");
    expect(nw(await res.text())).toBe(BAD);
  });

  it("Should bundle TSX", async () => {
    const res = await app.request("http://localhost/static/file.tsx");
    expect(res).not.toBeNull();
    expect(res.status).toBe(200);
    expect(nw(await res.text())).toBe(
      `"use strict"; (() => { // testdata/static/file.tsx var file_default = /* @__PURE__ */ React.createElement("h1", null, "Hello"); })();`
    );
  });
});
