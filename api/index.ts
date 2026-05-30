// @ts-nocheck
// Vercel serverless function for /api/*. It imports the PRE-BUNDLED Express app
// produced by `pnpm --filter @workspace/api-server build` (esbuild output at
// artifacts/api-server/dist/serverless.mjs). That bundle is fully self-contained
// (all workspace deps inlined), so this function needs no workspace module
// resolution — which is what tripped up Vercel's TypeScript compiler before.
//
// The Express app mounts its routes under /api, and the vercel.json rewrite
// preserves the original request path, so paths map through end-to-end.
export { default } from "../artifacts/api-server/dist/serverless.mjs";
