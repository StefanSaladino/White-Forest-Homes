/** List every production TODO with its source file and line number. */
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("../", import.meta.url);
const ignored = new Set(["node_modules", ".git"]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.isFile()) files.push(path);
  }

  return files;
}

const rootPath = root.pathname;
const files = await walk(rootPath);
let count = 0;

for (const file of files) {
  const info = await stat(file);
  if (info.size > 2_000_000 || /\.(webp|jpg|png|svg)$/i.test(file)) continue;

  const text = await readFile(file, "utf8");
  text.split(/\r?\n/).forEach((line, index) => {
    if (!line.includes("TODO(PROD)")) return;
    count += 1;
    console.log(`${relative(rootPath, file)}:${index + 1} ${line.trim()}`);
  });
}

console.log(`\n${count} production TODO${count === 1 ? "" : "s"} found.`);
