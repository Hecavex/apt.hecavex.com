import fs from "node:fs";
import path from "node:path";

const roots = ["src", "scripts"];
const errors = [];

const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const itemPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(itemPath);
      continue;
    }
    if (!/\.(astro|css|ts|mjs|md)$/.test(entry.name)) {
      continue;
    }
    const source = fs.readFileSync(itemPath, "utf8");
    source.split(/\r?\n/).forEach((line, index) => {
      if (/[ \t]+$/.test(line)) {
        errors.push(`${itemPath}:${index + 1}: trailing whitespace`);
      }
      if (line.includes("\t")) {
        errors.push(`${itemPath}:${index + 1}: tab character`);
      }
    });
  }
};

roots.forEach(walk);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Lint checks passed.");
