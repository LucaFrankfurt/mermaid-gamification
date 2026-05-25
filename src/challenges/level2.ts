import { Challenge, ValidationResult, hasConnection, hasConnectionWithLabel } from './types';

export const level2: Challenge = {
  level: 2,
  beltEmoji: "🟨",
  badgeEmoji: "🔍",
  xpReward: 100,
  starterCode: `graph TD
    Start[Lost Post-it] --> IsItOnFloor{Is it on the floor?}
    %% Sensei Hint: Define the YES and NO branching paths below!
    %% Example: IsItOnFloor -->|Yes| UnderDesk[Look under the desk]
    %% Remember to connect both UnderDesk and CheckBin back to Found[Secret Password Recovered]!
`,
  solution: `graph TD
    Start[Lost Post-it] --> IsItOnFloor{Is it on the floor?}
    IsItOnFloor -->|Yes| UnderDesk[Look under the desk]
    IsItOnFloor -->|No| CheckBin[Check recycling bin]
    UnderDesk --> Found[Secret Password Recovered]
    CheckBin --> Found`,
  en: {
    name: "Yellow Belt",
    badgeName: "The Master of Decisions",
    story: "A grave security emergency has struck the office. A physical Post-it note containing the root password for our production deployment has mysteriously gone missing from the physical Scrum board. As a Yellow Belt, you must construct a robust branching flow to find it before the auditor arrives!",
    mission: "Create a flowchart containing a decision node. If the post-it is on the floor, look under the desk to recover it. Otherwise, search the recycling bin. Connect both paths back to the successful 'Found' terminal node.",
    checklist: [
      "Starts with flowchart declaration (e.g. graph TD)",
      "Decision node 'IsItOnFloor' uses curly brackets: IsItOnFloor{Is it on the floor?}",
      "Labeled arrow for YES path: -->|Yes| UnderDesk[Look under the desk]",
      "Labeled arrow for NO path: -->|No| CheckBin[Check recycling bin]",
      "Both paths (UnderDesk and CheckBin) must terminate at: Found[Secret Password Recovered]"
    ],
    spickzettel: [
      { syntax: "A{Decision Text}", desc: "Create a diamond-shaped decision node (ID 'A')" },
      { syntax: "A -->|Label| B", desc: "Draw an arrow with text label inline" }
    ],
    hint: {
      decl: "Sensei says: Begin with a flowchart declaration like 'graph TD'!",
      decision: "Sensei says: Decisions are shaped like diamonds. Make sure your decision node 'IsItOnFloor' uses curly braces: 'IsItOnFloor{Is it on the floor?}'.",
      yesPath: "Sensei says: The 'Yes' path is missing! Branch from 'IsItOnFloor' to 'UnderDesk' using: 'IsItOnFloor -->|Yes| UnderDesk[Look under the desk]'.",
      noPath: "Sensei says: The 'No' path is missing! Branch from 'IsItOnFloor' to 'CheckBin' using: 'IsItOnFloor -->|No| CheckBin[Check recycling bin]'.",
      underLink: "Sensei says: You looked under the desk but forgot to retrieve the password! Connect 'UnderDesk' to 'Found'.",
      binLink: "Sensei says: You rummaged through the bin but forgot to retrieve the password! Connect 'CheckBin' to 'Found'.",
      foundNode: "Sensei says: The end goal is lost! Make sure the terminal node 'Found' is labeled 'Secret Password Recovered'."
    }
  },
  de: {
    name: "Gelber Gürtel",
    badgeName: "Meister der Entscheidungen",
    story: "Ein schwerer Sicherheitsnotfall betrifft das Büro! Ein physisches Post-it mit dem Root-Passwort für unser Produktions-Deployment ist vom Scrum-Board verschwunden. Als gelber Gürtel musst du einen stabilen Verzweigungsfluss erstellen, um es vor dem Eintreffen des Prüfers zu finden!",
    mission: "Erstelle ein Flussdiagramm mit einem Entscheidungsknoten. Wenn das Post-it auf dem Boden liegt, schaue unter den Schreibtisch, um es zu holen. Andernfalls durchsuche den Papierkorb. Führe beide Pfade zum erfolgreichen Endknoten 'Found' zusammen.",
    checklist: [
      "Beginnt mit der Flussdiagramm-Deklaration (z. B. graph TD)",
      "Entscheidungsknoten 'IsItOnFloor' nutzt geschweifte Klammern: IsItOnFloor{Is it on the floor?}",
      "Beschrifteter Pfeil für JA-Pfad: -->|Yes| UnderDesk[Look under the desk]",
      "Beschrifteter Pfeil für NEIN-Pfad: -->|No| CheckBin[Check recycling bin]",
      "Beide Pfade enden beim Abschlussknoten: Found[Secret Password Recovered]"
    ],
    spickzettel: [
      { syntax: "A{Decision Text}", desc: "Erstellt einen rautenförmigen Entscheidungsknoten (ID 'A')" },
      { syntax: "A -->|Label| B", desc: "Zeichnet einen Pfeil mit Beschriftungstext in der Linie" }
    ],
    hint: {
      decl: "Sensei sagt: Beginne mit einer Flussdiagramm-Deklaration wie 'graph TD'!",
      decision: "Sensei sagt: Entscheidungen sind rautenförmig. Stelle sicher, dass dein Entscheidungsknoten 'IsItOnFloor' geschweifte Klammern verwendet: 'IsItOnFloor{Is it on the floor?}'.",
      yesPath: "Sensei sagt: Der 'Yes'-Pfad fehlt! Verzweige von 'IsItOnFloor' zu 'UnderDesk' mit: 'IsItOnFloor -->|Yes| UnderDesk[Look under the desk]'.",
      noPath: "Sensei sagt: Der 'No'-Pfad fehlt! Verzweige von 'IsItOnFloor' zu 'CheckBin' mit: 'IsItOnFloor -->|No| CheckBin[Check recycling bin]'.",
      underLink: "Sensei sagt: Du hast unter dem Schreibtisch nachgesehen, aber vergessen, das Passwort aufzuheben! Verbinde 'UnderDesk' mit 'Found'.",
      binLink: "Sensei sagt: Du hast den Papierkorb durchwühlt, aber vergessen, das Passwort aufzuheben! Verbinde 'CheckBin' mit 'Found'.",
      foundNode: "Sensei sagt: Das Endziel ist verloren! Stelle sicher, dass der Endknoten 'Found' das Label 'Secret Password Recovered' hat."
    }
  },
  validate: (code: string): ValidationResult => {
    const clean = code.trim().replace(/\s+/g, '');
    const lower = code.toLowerCase();

    if (!lower.includes("graph td") && !lower.includes("flowchart td") && !lower.includes("graph lr") && !lower.includes("flowchart lr")) {
      return { success: false, hintKey: "decl" };
    }

    if (!code.includes("IsItOnFloor{") || !code.includes("}")) {
      return { success: false, hintKey: "decision" };
    }

    const hasYesBranch = hasConnectionWithLabel(clean, 'IsItOnFloor', 'UnderDesk', 'Yes');
    const hasNoBranch = hasConnectionWithLabel(clean, 'IsItOnFloor', 'CheckBin', 'No');

    if (!hasYesBranch) return { success: false, hintKey: "yesPath" };
    if (!hasNoBranch) return { success: false, hintKey: "noPath" };

    const underDeskToFound = hasConnection(clean, 'UnderDesk', 'Found');
    const checkBinToFound = hasConnection(clean, 'CheckBin', 'Found');

    if (!underDeskToFound) return { success: false, hintKey: "underLink" };
    if (!checkBinToFound) return { success: false, hintKey: "binLink" };

    if (!lower.includes("secret password recovered")) {
      return { success: false, hintKey: "foundNode" };
    }

    return { success: true };
  },
  getChecklistStatus: (code: string): boolean[] => {
    const clean = code.trim().replace(/\s+/g, '');
    const lower = code.toLowerCase();
    return [
      lower.includes("graph td") || lower.includes("flowchart td") || lower.includes("graph lr") || lower.includes("flowchart lr"),
      code.includes("IsItOnFloor{") && code.includes("}"),
      hasConnectionWithLabel(clean, 'IsItOnFloor', 'UnderDesk', 'Yes'),
      hasConnectionWithLabel(clean, 'IsItOnFloor', 'CheckBin', 'No'),
      hasConnection(clean, 'UnderDesk', 'Found') && hasConnection(clean, 'CheckBin', 'Found') && lower.includes("secret password recovered")
    ];
  }
};
