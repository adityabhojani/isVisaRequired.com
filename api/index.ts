// Vercel serverless function — catches every /api/* request and hands it to the
// Express app from the api-server workspace package. The Express app already
// mounts its routes under `/api`, so the path is preserved end-to-end.
//
// `includeFiles` in vercel.json ships the passport-index.csv data file that the
// API reads at runtime.
export { default } from "@workspace/api-server/serverless";
