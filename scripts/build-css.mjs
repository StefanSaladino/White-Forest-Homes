/**
 * Build the optional compatibility CSS bundle from role-based source files.
 *
 * The file order intentionally mirrors the original cascade. Do not reorder
 * entries without visually regression-testing every page and viewport.
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("../", import.meta.url).pathname);
// HTML pages load the modular files directly; this output is retained for compatibility checks.
const outputPath = resolve(root, "assets/css/styles.v1.css");
const sourceFiles = [
  "assets/css/src/tokens.css",
  "assets/css/src/base/foundations.css",
  "assets/css/src/base/global.css",
  "assets/css/src/components/navigation.css",
  "assets/css/src/components/heroes.css",
  "assets/css/src/pages/home.css",
  "assets/css/src/pages/projects.css",
  "assets/css/src/pages/services.css",
  "assets/css/src/pages/process-about.css",
  "assets/css/src/pages/contact.css",
  "assets/css/src/components/cta-footer.css",
  "assets/css/src/components/consent.css",
  "assets/css/src/pages/utility-pages.css",
  "assets/css/src/components/animations.css",
  "assets/css/src/responsive/tablet.css",
  "assets/css/src/responsive/desktop.css",
];

const bundle = (
  await Promise.all(sourceFiles.map((file) => readFile(resolve(root, file), "utf8")))
).join("");

if (process.argv.includes("--check")) {
  const currentBundle = await readFile(outputPath, "utf8");

  if (currentBundle !== bundle) {
    console.error("Compatibility CSS bundle is out of date. Run: npm run build:css");
    process.exitCode = 1;
  } else {
    console.log("Compatibility CSS bundle matches all role-based source files.");
  }
} else {
  await writeFile(outputPath, bundle, "utf8");
  console.log(`Built ${sourceFiles.length} CSS source files into the optional assets/css/styles.v1.css compatibility bundle.`);
}
