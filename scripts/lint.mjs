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

const cssPath = path.join("src", "styles", "global.css");
const css = fs.readFileSync(cssPath, "utf8");
const cssContract = [
  [/--page-gutter:\s*clamp\(1rem,\s*3\.5vw,\s*3\.5rem\);/, "missing shared page gutter token"],
  [/--space-page-top:\s*clamp\(3\.25rem,\s*5vw,\s*4\.75rem\);/, "missing shared page-top token"],
  [/--space-page-bottom:\s*clamp\(4rem,\s*8vw,\s*8rem\);/, "missing shared page-bottom token"],
  [/--space-major-section:\s*clamp\(3\.5rem,\s*7vw,\s*6\.5rem\);/, "missing shared major-section token"],
  [/--frame-product-hero:\s*clamp\(21rem,\s*26\.2vw,\s*23\.5625rem\);/, "missing responsive product-hero frame token"],
  [/--type-page-title:\s*clamp\(2\.4rem,\s*3\.6vw,\s*3\.25rem\);/, "missing shared page-title token"],
  [/--type-display-title:\s*clamp\(2\.5rem,\s*4\.2vw,\s*4rem\);/, "missing shared display-title token"],
  [/--type-section-title:\s*clamp\(1\.45rem,\s*2\.4vw,\s*2rem\);/, "missing shared section-title token"],
  [/\.shell\s*\{[^}]*width:\s*min\(100%,\s*var\(--content\)\);[^}]*padding-inline:\s*var\(--page-gutter\);/s, "shell must use the shared width and inline gutter"],
  [/main\s*>\s*\.shell\s*\{[^}]*padding-top:\s*var\(--space-page-top\);[^}]*padding-bottom:\s*var\(--space-page-bottom\);/s, "top-level shells must use shared page fields"],
  [/\.brand-hero\s*\{[^}]*min-height:\s*var\(--frame-product-hero\);/s, "product hero must use the shared responsive frame"],
  [/\.brand-hero h1\s*\{[^}]*font-size:\s*var\(--type-page-title\);[^}]*line-height:\s*1;/s, "product title must use the shared page-title scale"],
  [/\.page-head h1\s*\{[^}]*font-size:\s*var\(--type-page-title\);[^}]*line-height:\s*1;/s, "internal page titles must use the shared title scale"],
  [/\.profile-head\s*\{[^}]*max-width:\s*64rem;/s, "profile heading measure must remain 64rem"],
  [/\.profile-head h1\s*\{[^}]*font-size:\s*var\(--type-display-title\);[^}]*line-height:\s*1;/s, "profile titles must use the shared display-title scale"],
  [/\.about-summary h1\s*\{[^}]*font-size:\s*var\(--type-page-title\);[^}]*line-height:\s*1;/s, "about title must use the shared page-title scale"],
  [/\.methodology-heading h1\s*\{[^}]*font-size:\s*var\(--type-page-title\);[^}]*line-height:\s*1;/s, "methodology title must use the shared page-title scale"],
  [/\.knowledge-record__header h1\s*\{[^}]*font-size:\s*clamp\(1\.85rem,\s*3\.2vw,\s*2\.8rem\);/s, "compact knowledge-record title scale changed"],
  [/\.brand img\s*\{[^}]*width:\s*2\.25rem;[^}]*height:\s*2\.25rem;/s, "masthead mark must remain 36px"],
  [/@media\s*\(min-width:\s*901px\)/, "missing wide-layout lower boundary"],
  [/@media\s*\(max-width:\s*1160px\)/, "missing macro-navigation breakpoint"],
  [/@media\s*\(max-width:\s*900px\)/, "missing general-layout breakpoint"],
  [/@media\s*\(max-width:\s*680px\)/, "missing compact-layout breakpoint"],
  [/@media\s*\(max-width:\s*390px\)/, "missing narrow-layout breakpoint"],
];

for (const [pattern, message] of cssContract) {
  if (!pattern.test(css)) {
    errors.push(`${cssPath}: ${message}`);
  }
}

if (/@media\s*\(max-width:\s*849px\)/.test(css)) {
  errors.push(`${cssPath}: obsolete 849px general-layout breakpoint`);
}

if (/@media\s*\(min-width:\s*850px\)/.test(css)) {
  errors.push(`${cssPath}: obsolete 850px wide-layout breakpoint`);
}

const macroStart = css.indexOf("@media (max-width: 1160px)");
const generalStart = css.indexOf("@media (max-width: 900px)");
const compactStart = css.indexOf("@media (max-width: 680px)");
const macroCss = css.slice(macroStart, generalStart);

if (!/\.profile-grid\s*\{[^}]*display:\s*block;/.test(macroCss)
  || !/\.profile-toc\s*\{[^}]*display:\s*none;/.test(macroCss)
  || !/\.profile-toc-mobile\s*\{[^}]*display:\s*block;/.test(macroCss)) {
  errors.push(`${cssPath}: profile rail must stack inside the 1160px macro breakpoint`);
}

if (!(macroStart >= 0 && macroStart < generalStart && generalStart < compactStart)) {
  errors.push(`${cssPath}: responsive breakpoints are missing or out of order`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Lint checks passed.");
