# esbuild Bundler Middleware

The **esbuild Bundler Middleware** is a Hono Middleware designed to bundle content such as TypeScript or TSX.
You can place your script written in TypeScript in a directory.
When you apply this Middleware, the script will be bundled into JavaScript code.

This Middleware uses esbuild. It works only on Node.js.

## Usage

### Node.js

#### Installation

```text
npm i hono @hono/node-server @syumai/hono-esbuild-bundler esbuild
```

#### Example

```ts
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { esbuildBundler } from '@syumai/hono-esbuild-bundler/node'

const app = new Hono()

app.get('/static/:scriptName{.+.tsx?}', esbuildBundler())

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
