// scripts/check-i18n.ts
import en from "../src/i18n/en";
import de from "../src/i18n/de";

function getKeys(obj: any, prefix = ""): string[] {
  return Object.keys(obj).reduce((res: string[], el) => {
    if (Array.isArray(obj[el])) return res;
    if (typeof obj[el] === "object" && obj[el] !== null) {
      return [...res, ...getKeys(obj[el], prefix + el + ".")];
    }
    return [...res, prefix + el];
  }, []);
}

const enKeys = getKeys(en).sort();
const deKeys = getKeys(de).sort();

const missingInDe = enKeys.filter((x) => !deKeys.includes(x));
const missingInEn = deKeys.filter((x) => !enKeys.includes(x));

if (missingInDe.length || missingInEn.length) {
  if (missingInDe.length)
    console.error("❌ Keys missing in German (de.ts):", missingInDe);
  if (missingInEn.length)
    console.error("❌ Keys missing in English (en.ts):", missingInEn);
  process.exit(1);
} else {
  console.log("✅ Translation packs are perfectly synchronized!");
  process.exit(0);
}
