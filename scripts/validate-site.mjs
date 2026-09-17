/**
 * Dependency-free static-site validation.
 * Checks internal file references, required SEO tags, one H1 per page,
 * JSON-LD parsing, image dimensions and explicit TODO coverage.
 */
import { access, readdir, readFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const htmlFiles = (await readdir(root)).filter((file) => extname(file) === ".html");
const failures = [];
const warnings = [];
const titles = new Map();
const canonicalURLs = new Set();
const documents = new Map(await Promise.all(htmlFiles.map(async (file) => [file, await readFile(join(root, file), "utf8")])));

const expectedStylesheets = [
  "assets/css/src/tokens.css?v=2",
  "assets/css/src/base/foundations.css?v=2",
  "assets/css/src/base/global.css?v=2",
  "assets/css/src/components/navigation.css?v=2",
  "assets/css/src/components/heroes.css?v=2",
  "assets/css/src/pages/home.css?v=2",
  "assets/css/src/pages/projects.css?v=2",
  "assets/css/src/pages/services.css?v=2",
  "assets/css/src/pages/process-about.css?v=2",
  "assets/css/src/pages/contact.css?v=2",
  "assets/css/src/components/cta-footer.css?v=2",
  "assets/css/src/components/consent.css?v=2",
  "assets/css/src/pages/utility-pages.css?v=2",
  "assets/css/src/components/animations.css?v=2",
  "assets/css/src/responsive/tablet.css?v=2",
  "assets/css/src/responsive/desktop.css?v=2",
];

function matches(text, expression) {
  return [...text.matchAll(expression)];
}

for (const file of htmlFiles) {
  const path = join(root, file);
  const html = await readFile(path, "utf8");
  const markup = html.replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, "$1</script>");

  const requiredPatterns = [
    [/<title>[^<]+<\/title>/i, "title"],
    [/<meta\s+name="description"\s+content="[^"]+"/i, "meta description"],
    [/<link\s+rel="canonical"\s+href="https:\/\/www\.whiteforesthomes\.com\/[^"]*"/i, "canonical URL"],
    [/<meta\s+property="og:title"/i, "Open Graph title"],
    [/<script\s+type="application\/ld\+json">/i, "JSON-LD"],
  ];

  for (const [pattern, label] of requiredPatterns) {
    if (!pattern.test(html)) failures.push(`${file}: missing ${label}`);
  }


  const stylesheetRefs = matches(
    html,
    /<link\s+rel="stylesheet"\s+href="([^"]+)"/gi,
  ).map((match) => match[1]).filter((ref) => !ref.includes("no-js.css"));

  if (stylesheetRefs.includes("assets/css/styles.v1.css")) {
    failures.push(`${file}: still references the old monolithic stylesheet`);
  }

  if (JSON.stringify(stylesheetRefs) !== JSON.stringify(expectedStylesheets)) {
    failures.push(`${file}: modular stylesheet list is missing or out of order`);
  }

  const h1Count = matches(html, /<h1\b/gi).length;
  if (h1Count !== 1) failures.push(`${file}: expected 1 H1, found ${h1Count}`);

  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] || "";
  if (titles.has(title)) failures.push(`${file}: duplicate title also used by ${titles.get(title)}`);
  titles.set(title, file);
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  if (canonicalURLs.has(canonical)) failures.push(`${file}: duplicate canonical URL ${canonical}`);
  canonicalURLs.add(canonical);
  if (canonical && !canonical.endsWith(file === "index.html" ? "/" : `/${file}`)) failures.push(`${file}: canonical points at another page`);
  const ids = matches(html, /\bid="([^"]+)"/gi).map((match) => match[1]);
  if (new Set(ids).size !== ids.length) failures.push(`${file}: duplicate element IDs`);
  for (const match of matches(html, /\b(?:aria-labelledby|aria-describedby|aria-controls|for)="([^"]+)"/gi)) {
    for (const id of match[1].split(/\s+/)) if (!ids.includes(id)) failures.push(`${file}: missing accessibility target #${id}`);
  }
  if (title.length > 65) warnings.push(`${file}: title is ${title.length} characters`);

  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] || "";
  if (!/name="robots" content="noindex/.test(html) && (description.length < 120 || description.length > 165)) {
    warnings.push(`${file}: description is ${description.length} characters`);
  }

  for (const jsonMatch of matches(html, /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(jsonMatch[1]);
    } catch (error) {
      failures.push(`${file}: invalid JSON-LD (${error.message})`);
    }
  }

  const refs = matches(markup, /\b(?:href|src)="([^"]+)"/gi).map((match) => match[1]);
  for (const ref of refs) {
    if (/^(?:https?:|mailto:|tel:|data:)/i.test(ref)) continue;
    if (/^javascript:/i.test(ref) || ref === "#") {
      failures.push(`${file}: placeholder or unsafe reference ${ref}`);
      continue;
    }
    if (ref.includes("#")) {
      const [destination, fragment] = ref.split("#");
      const fragmentFile = destination.split("?")[0] || file;
      const contents = documents.get(fragmentFile) || await readFile(join(root, fragmentFile), "utf8").catch(() => "");
      let id;
      try { id = decodeURIComponent(fragment); } catch { id = fragment; }
      if (!matches(contents, /\bid="([^"]+)"/gi).some((match) => match[1] === id)) failures.push(`${file}: missing anchor/symbol target ${ref}`);
    }
    const clean = ref.split("#")[0].split("?")[0];
    if (!clean || clean === "/") continue;

    const target = clean.startsWith("/") ? join(root, clean.slice(1)) : join(root, clean);
    try {
      await access(target);
    } catch {
      failures.push(`${file}: missing internal reference ${ref}`);
    }
  }

  for (const match of matches(html, /\bsrcset="([^"]+)"/gi)) {
    for (const item of match[1].split(",")) {
      const ref = item.trim().split(/\s+/)[0];
      if (/^https?:/.test(ref)) continue;
      try { await access(join(root, ref)); } catch { failures.push(`${file}: missing responsive image ${ref}`); }
    }
  }

  for (const match of matches(html, /<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    if (!/\bhref="[^"]+"/.test(match[1])) failures.push(`${file}: anchor without a destination`);
    if (!/aria-label(?:ledby)?="[^"]+"/.test(match[1]) && !match[2].replace(/<[^>]*>/g, "").trim() && !/alt="[^"]+"/.test(match[2])) failures.push(`${file}: link without an accessible name`);
    if (/target="_blank"/.test(match[1]) && !/rel="[^"]*noopener/.test(match[1])) failures.push(`${file}: new-tab link missing noopener`);
  }

  if (/\sstyle=/.test(html)) failures.push(`${file}: inline style is blocked by the site's Content Security Policy`);

  for (const image of matches(html, /<img\b[^>]*>/gi).map((match) => match[0])) {
    if (!/\balt="[^"]*"/i.test(image)) failures.push(`${file}: image missing alt attribute`);
    if (!/\bwidth="\d+"/i.test(image) || !/\bheight="\d+"/i.test(image)) {
      failures.push(`${file}: image missing width/height`);
    }
  }
}

const manifest = JSON.parse(await readFile(join(root, "site.webmanifest"), "utf8"));
for (const reference of [manifest.start_url, manifest.scope, ...manifest.icons.map((icon) => icon.src)]) {
  if (reference.startsWith("/")) failures.push(`Manifest URL ${reference} escapes a GitHub Pages project subdirectory`);
}

const rootFiles = ["robots.txt", "sitemap.xml", "site.webmanifest", "llms.txt", "privacy.html", "TODO-PRODUCTION.md"];
for (const file of rootFiles) {
  try {
    await access(join(root, file));
  } catch {
    failures.push(`Missing required root file: ${file}`);
  }
}

console.log(`Validated ${htmlFiles.length} HTML files.`);
if (warnings.length) {
  console.log("\nWarnings:");
  warnings.forEach((warning) => console.log(`- ${warning}`));
}
if (failures.length) {
  console.error("\nFailures:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("No blocking validation failures.");
}
