import { cp, mkdir, rm } from "node:fs/promises";

const outputDirectory = new URL("../dist/", import.meta.url);
const projectDirectory = new URL("../", import.meta.url);
const files = ["index.html", "styles.css", "script.js", "analytics.js", "speed-insights.js"];
const directories = ["terms", "privacy", "legal", "cookies", "ai-use", "story"];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  files.map((file) =>
    cp(new URL(file, projectDirectory), new URL(file, outputDirectory)),
  ),
);

await Promise.all(
  directories.map((directory) =>
    cp(new URL(directory, projectDirectory), new URL(directory, outputDirectory), {
      recursive: true,
    }),
  ),
);

await cp(
  new URL("assets", projectDirectory),
  new URL("assets", outputDirectory),
  { recursive: true },
);

console.log("Built static site in dist/");
