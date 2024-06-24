import { createMiddleware } from "hono/factory";
import type { build, initialize } from "./types.esbuild";

export type EsbuildLike = {
  build: typeof build;
  initialize: typeof initialize;
};

export type BuildOptions = Partial<Parameters<typeof build>[0]>;

export type EsbuildBundlerOptions = {
  extensions?: string[];
  cache?: boolean;
  esbuild?: EsbuildLike;
  contentType?: string;
  buildOptions?: BuildOptions;
};

export const esbuildBundler = (options?: EsbuildBundlerOptions) => {
  const esbuild: EsbuildLike | undefined = options?.esbuild;

  return createMiddleware(async (c, next) => {
    await next();
    if (esbuild) {
      const url = new URL(c.req.url);
      const extensions = options?.extensions ?? [".ts", ".tsx"];

      if (extensions.every((ext) => !url.pathname.endsWith(ext))) {
        return;
      }

      const script = await c.res.text();
      const buildOptions: BuildOptions = options?.buildOptions ?? {};

      try {
        const { errors, outputFiles } = await esbuild.build({
          ...buildOptions,
          // entryPoints: [],
          bundle: true,
          write: false,
        });
        if (errors.length > 0) {
          throw new Error(errors.map((error) => error.text).join("\n"));
        }
        if (!outputFiles?.[0]) {
          throw new Error("outputFiles must exist");
        }
        const code = outputFiles[0].text;
        c.res = c.body(code);
        c.res.headers.set(
          "content-type",
          options?.contentType ?? "text/javascript"
        );
        c.res.headers.delete("content-length");
      } catch (ex) {
        console.warn("Error bundling " + url.pathname + ": " + ex);
        c.res = new Response(script, {
          status: 500,
          headers: {
            "content-type": options?.contentType ?? "text/javascript",
          },
        });
      }
    }
  });
};
