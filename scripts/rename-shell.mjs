// Vercel build step: rename the built SPA shell index.html → shell.html.
// Why: Vercel serves static files BEFORE rewrites, so a static index.html at /
// always beats the "/" → serverless rewrite and homepage SSR never runs.
// With the file renamed, / falls through to the function; the SPA catch-all
// rewrite serves /shell.html instead.
import fs from "fs";
const dir = "artifacts/visa-checker/dist/public/";
fs.copyFileSync(dir + "index.html", dir + "shell.html");
fs.unlinkSync(dir + "index.html");
console.log("shell: index.html → shell.html");
