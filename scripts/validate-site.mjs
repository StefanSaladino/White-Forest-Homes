/**
 * Dependency-free static-site validation.
 * Checks internal file references, required SEO tags, one H1 per page,
 * JSON-LD parsing, image dimensions and explicit TODO coverage.
 */
import { access, readdir, readFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(new URL("../", import.meta.url).pathname);
const htmlFiles = (await readdir(root)).filter((file) => extname(file) === ".html");
const failures = [];
const warnings = [];

const expectedStylesheets = [
  "assets/css/src/tokens.css?v=1",
  "assets/css/src/base/foundations.css?v=1",
  "assets/css/src/base/global.css?v=1",
  "assets/css/src/components/navigation.css?v=1",
  "assets/css/src/components/heroes.css?v=1",
  "assets/css/src/pages/home.css?v=1",
  "assets/css/src/pages/projects.css?v=1",
  "assets/css/src/pages/services.css?v=1",
  "assets/css/src/pages/process-about.css?v=1",
  "assets/css/src/pages/contact.css?v=1",
  "assets/css/src/components/cta-footer.css?v=1",
  "assets/css/src/components/consent.css?v=1",
  "assets/css/src/pages/utility-pages.css?v=1",
  "assets/css/src/components/animations.css?v=1",
  "assets/css/src/responsive/tablet.css?v=1",
  "assets/css/src/responsive/desktop.css?v=1",
];

function matches(text, expression) {
  return [...text.matchAll(expression)];
}

for (const file of htmlFiles) {
  const path = join(root, file);
  const html = await readFile(path, "utf8");

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
  ).map((match) => match[1]);

  if (stylesheetRefs.includes("assets/css/styles.v1.css")) {
    failures.push(`${file}: still references the old monolithic stylesheet`);
  }

  if (JSON.stringify(stylesheetRefs) !== JSON.stringify(expectedStylesheets)) {
    failures.push(`${file}: modular stylesheet list is missing or out of order`);
  }

  const h1Count = matches(html, /<h1\b/gi).length;
  if (h1Count !== 1) failures.push(`${file}: expected 1 H1, found ${h1Count}`);

  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] || "";
  if (title.length > 65) warnings.push(`${file}: title is ${title.length} characters`);

  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] || "";
  if (description.length < 120 || description.length > 165) {
    warnings.push(`${file}: description is ${description.length} characters`);
  }

  for (const jsonMatch of matches(html, /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(jsonMatch[1]);
    } catch (error) {
      failures.push(`${file}: invalid JSON-LD (${error.message})`);
    }
  }

  const refs = matches(html, /\b(?:href|src)="([^"]+)"/gi).map((match) => match[1]);
  for (const ref of refs) {
    if (/^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(ref)) continue;
    const clean = ref.split("#")[0].split("?")[0];
    if (!clean || clean === "/") continue;

    const target = clean.startsWith("/") ? join(root, clean.slice(1)) : join(root, clean);
    try {
      await access(target);
    } catch {
      failures.push(`${file}: missing internal reference ${ref}`);
    }
  }

  for (const image of matches(html, /<img\b[^>]*>/gi).map((match) => match[0])) {
    if (!/\balt="[^"]*"/i.test(image)) failures.push(`${file}: image missing alt attribute`);
    if (!/\bwidth="\d+"/i.test(image) || !/\bheight="\d+"/i.test(image)) {
      failures.push(`${file}: image missing width/height`);
    }
  }
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
