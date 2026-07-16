import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const ignoredDirectories = new Set([".git", "assets", "dist", "node_modules"]);
const checkedExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".mjs"]);
const checkedNames = new Set([".env.example", ".gitignore", ".vercelignore"]);
const encodedTypography = /&(?:copy|hellip|mdash|ndash|nearr|nbsp|rarr);|&#(?:160|169|8211|8212|8216|8217|8220|8221|8230|8594|8599);/gi;
const disallowedUnicode = /[^\x00-\x7f€]/gu;
const separatorDash = /[A-Za-z0-9'"`]\s+-\s+[A-Za-z0-9'"`]/g;

const failures = [];

const lineNumberAt = (source, index) => source.slice(0, index).split("\n").length;

const reportMatches = (file, source, pattern, label) => {
  pattern.lastIndex = 0;
  for (const match of source.matchAll(pattern)) {
    failures.push(`${file}:${lineNumberAt(source, match.index)}: ${label}`);
  }
};

const humanTextSegments = (file, source) => {
  const extension = extname(file);
  if (extension === ".html") {
    const segments = [];
    for (const match of source.matchAll(/>([^<]+)</gs)) segments.push(match[1]);
    for (const match of source.matchAll(/\b(?:alt|aria-label|content|placeholder|title)="([^"]*)"/g)) segments.push(match[1]);
    return segments;
  }

  if (extension === ".md") {
    let inFence = false;
    return source.split("\n").flatMap((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return [];
      }
      if (inFence) return [];
      return [line.replace(/^\s*[-*]\s+/, "").replace(/`[^`]*`/g, "")];
    });
  }

  if (extension === ".js" || extension === ".mjs") {
    return source.split("\n").filter((line) => /["'`]|\/\/|\/\*/.test(line));
  }

  return [];
};

const collectFiles = async (directory) => {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(path));
    else if (checkedExtensions.has(extname(entry.name)) || checkedNames.has(entry.name)) files.push(path);
  }
  return files;
};

const commitMessageFlag = process.argv.indexOf("--commit-message");
if (commitMessageFlag !== -1) {
  const messageFile = process.argv[commitMessageFlag + 1];
  if (!messageFile) throw new Error("A commit message file is required.");
  const source = await readFile(messageFile, "utf8");
  reportMatches("commit message", source, disallowedUnicode, "disallowed Unicode punctuation");
  reportMatches("commit message", source, separatorDash, "hyphen used as a separator");
} else {
  for (const path of await collectFiles(root)) {
    const file = relative(root, path);
    const source = await readFile(path, "utf8");
    reportMatches(file, source, disallowedUnicode, "disallowed Unicode punctuation");
    reportMatches(file, source, encodedTypography, "encoded typographic punctuation");
    for (const segment of humanTextSegments(file, source)) {
      if (separatorDash.test(segment)) {
        failures.push(`${file}: hyphen used as a sentence separator`);
        separatorDash.lastIndex = 0;
      }
    }
  }
}

if (failures.length) {
  console.error("Character rule check failed:");
  failures.forEach((failure) => console.error(`* ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Character rule check passed.");
}
