import * as esbuild from "esbuild";
import { createMiddleware } from "hono/factory";
import { esbuildBundler as baseBundler } from "../bundler";
import type { EsbuildBundlerOptions } from "../bundler";

const bundler = (options?: Partial<Omit<EsbuildBundlerOptions, "esbuild">>) => {
  return createMiddleware(async (c, next) => {
    return await baseBundler({
      esbuild,
      ...options,
    })(c, next);
  });
};

export { bundler as esbuildBundler };
