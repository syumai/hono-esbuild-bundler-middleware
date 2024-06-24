import * as esbuild from "esbuild-wasm";
import { createMiddleware } from "hono/factory";
import { esbuildBundler as baseBundler } from "../bundler";
import type { EsbuildBundlerOptions } from "../bundler";

let initialized = false;

const bundler = (
  options: Partial<Omit<EsbuildBundlerOptions, "esbuild">> & {
    wasmModule?: WebAssembly.Module;
    wasmURL?: string | URL;
  }
) => {
  return createMiddleware(async (c, next) => {
    if (!initialized) {
      if (options.wasmModule) {
        await esbuild.initialize({
          wasmModule: options.wasmModule,
          worker: false,
        });
      } else if (options.wasmURL) {
        await esbuild.initialize({
          wasmURL: options.wasmURL,
          worker: false,
        });
      } else {
        throw "wasmModule or wasmURL option is required.";
      }
      initialized = true;
    }
    return await baseBundler({
      esbuild,
      ...options,
    })(c, next);
  });
};

export { bundler as esbuildBundler };
