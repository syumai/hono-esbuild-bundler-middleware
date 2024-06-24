# esbuild Bundler Middleware

The **esbuild Bundler Middleware** is a Hono Middleware designed to bundle content such as TypeScript or TSX.
You can place your script written in TypeScript in a directory and serve it using `serveStatic`.
When you apply this Middleware, the script will be bundled into JavaScript code.

This Middleware uses esbuild. It works on _Cloudflare Workers, Deno, Deno Deploy, or Node.js_.

## Usage

Usage differs depending on the platform.

### Cloudflare Workers / Pages

#### Installation

```text
npm i hono @syumai/hono-esbuild-bundler esbuild-wasm
```

#### Example

```ts
import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { esbuildBundler } from '@syumai/hono-esbuild-bundler/wasm'
// Specify the path of the esbuild wasm file.
import wasm from '../node_modules/esbuild-wasm/esbuild.wasm'

const app = new Hono()

app.get('/static/:scriptName{.+.tsx?}', esbuildBundler({ wasmModule: wasm }))
app.get('/static/*', serveStatic({ root: './' }))

export default app
```

`global.d.ts`:

```ts
declare module '*.wasm'
```

### Deno / Deno Deploy

#### Example

```ts
import { Hono } from 'npm:hono'

import { serveStatic } from 'npm:hono/deno'
import { esbuildBundler } from 'npm:@syumai/hono-esbuild-bundler'
import * as esbuild from 'https://deno.land/x/esbuild@v0.19.5/wasm.js'

const app = new Hono()

await esbuild.initialize({
  wasmURL: 'https://deno.land/x/esbuild@v0.19.5/esbuild.wasm',
  worker: false,
})

app.get('/static/*', esbuildBundler({ esbuild }))
app.get('/static/*', serveStatic())

Deno.serve(app.fetch)
```

### Node.js

#### Installation

```text
npm i hono @hono/node-server @syumai/hono-esbuild-bundler esbuild
```

#### Example

```ts
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { esbuildBundler } from '@syumai/hono-esbuild-bundler/node'

const app = new Hono()

app.get('/static/:scriptName{.+.tsx?}', esbuildBundler())
app.get('/static/*', serveStatic({ root: './' }))

serve(app)
```

## Notes

- This middleware does not have a cache feature. If you want to cache the bundled code, use [Cache Middleware](https://hono.dev/middleware/builtin/cache) or your own custom middleware.
- `@hono/vite-dev-server` does not support Wasm, so you can't use this Middleware with it. However, Vite can bundle them, so you might not need to use this.

## Authors

- syumai <https://github.com/syumai>
- Yusuke Wada <https://github.com/yusukebe>
- Andres C. Rodriguez <https://github.com/acrodrig>

Original idea and implementation for "_Typescript Bundler Middleware_" is by Andres C. Rodriguez.

## License

MIT
