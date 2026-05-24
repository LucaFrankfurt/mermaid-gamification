// scripts/check-i18n.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve exact files from the root
const enFilePath = path.resolve(__dirname, "../src/i18n/en.ts");
const deFilePath = path.resolve(__dirname, "../src/i18n/de.ts");

function extractKeys(filePath: string): string[] {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    // Match anything that looks like a key string followed by a colon
    // e.g., myKey: "value" or 'nestedKey': {
    const keyRegex = /([\w-]+)\s*:/g;
    const keys: string[] = [];
    let match;

    while ((match = keyRegex.exec(content)) !== null) {
      keys.push(match[1]);
    }
    return keys.sort();
  } catch (err) {
    console.error(`❌ Failed to read file at ${filePath}`, err);
    process.exit(1);
  }
}

const enKeys = extractKeys(enFilePath);
const deKeys = extractKeys(deFilePath);

const missingInDe = enKeys.filter((x) => !deKeys.includes(x));
const missingInEn = deKeys.filter((x) => !enKeys.includes(x));

console.log(
  `📊 Scanned translation keys. Found ${enKeys.length} in English, ${deKeys.length} in German.`,
);

if (missingInDe.length || missingInEn.length) {
  if (missingInDe.length)
    console.error("❌ Keys missing in German (de.ts):", missingInDe);
  if (missingInEn.length)
    console.error("❌ Keys missing in English (en.ts):", missingInEn);
  process.exit(1);
} else {
  console.log(
    "✅ Sensei Approval: Translation packs are perfectly synchronized!",
  );
  process.exit(0);
}
