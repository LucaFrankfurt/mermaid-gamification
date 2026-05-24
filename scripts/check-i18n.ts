// scripts/check-i18n.ts
// Validates that en.ts and de.ts share identical key structures by dynamically
// importing the actual modules and comparing their object shapes.
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enFilePath = path.resolve(__dirname, "../src/i18n/en.ts");
const deFilePath = path.resolve(__dirname, "../src/i18n/de.ts");

/** Recursively collect all dotted key paths from an object. */
function collectPaths(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return [prefix];
  }
  const paths: string[] = [];
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      paths.push(...collectPaths(val, fullKey));
    } else {
      paths.push(fullKey);
    }
  }
  return paths;
}

const enModule = await import(enFilePath);
const deModule = await import(deFilePath);

const enObj = enModule.default ?? enModule;
const deObj = deModule.default ?? deModule;

const enKeys = new Set(collectPaths(enObj));
const deKeys = new Set(collectPaths(deObj));

const missingInDe = [...enKeys].filter((k) => !deKeys.has(k)).sort();
const missingInEn = [...deKeys].filter((k) => !enKeys.has(k)).sort();

console.log(
  `📊 Scanned translation keys. Found ${enKeys.size} in English, ${deKeys.size} in German.`,
);

if (missingInDe.length || missingInEn.length) {
  if (missingInDe.length)
    console.error("❌ Keys missing in German (de.ts):\n  " + missingInDe.join("\n  "));
  if (missingInEn.length)
    console.error("❌ Keys missing in English (en.ts):\n  " + missingInEn.join("\n  "));
  process.exit(1);
} else {
  console.log(
    "✅ Sensei Approval: Translation packs are perfectly synchronized!",
  );
  process.exit(0);
}
