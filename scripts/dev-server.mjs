import { createReadStream } from "node:fs";
import { access, readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import contact from "../api/contact.js";

const args = process.argv.slice(2);
const directoryIndex = args.indexOf("--directory");
const portIndex = args.indexOf("--port");
const root = resolve(directoryIndex >= 0 ? args[directoryIndex + 1] : ".");
const port = Number(portIndex >= 0 ? args[portIndex + 1] : process.env.PORT || 4173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const loadLocalEnvironment = async () => {
  try {
    const source = await readFile(resolve(".env.local"), "utf8");
    source.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (!match || process.env[match[1]]) return;
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
    });
  } catch {
    // Local secrets are optional until the contact form is exercised.
  }
};

await loadLocalEnvironment();

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (url.pathname === "/api/contact") {
    await contact(request, response);
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  const requestedPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = resolve(root, `.${requestedPath}`);
  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    await access(filePath);
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) throw new Error("Not a file");
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Project Caligo is running at http://127.0.0.1:${port}`);
});
