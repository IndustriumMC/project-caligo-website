import { cp, mkdir, rm } from "node:fs/promises";

const outputDirectory = new URL("../dist/", import.meta.url);
const projectDirectory = new URL("../", import.meta.url);
const files = ["index.html", "styles.css", "script.js"];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  files.map((file) =>
    cp(new URL(file, projectDirectory), new URL(file, outputDirectory)),
  ),
);

await cp(
  new URL("assets", projectDirectory),
  new URL("assets", outputDirectory),
  { recursive: true },
);

console.log("Built static site in dist/");
