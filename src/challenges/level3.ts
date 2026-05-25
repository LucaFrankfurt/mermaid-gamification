import { Challenge, ValidationResult, hasConnection } from './types';

export const level3: Challenge = {
  level: 3,
  beltEmoji: "🟩",
  badgeEmoji: "📦",
  xpReward: 100,
  starterCode: `graph TD
    AppServer[Office App Server]
    
    subgraph "HQ Operations"
        %% Sensei Hint: Create your database node 'db' inside this subgraph!
        %% A database uses double brackets and parentheses: db[("Coffee Log Database")]
    end
    
    %% Sensei Hint: Connect the external AppServer to the internal db database here!
`,
  solution: `graph TD
    AppServer[Office App Server]
    subgraph "HQ Operations"
        db[("Coffee Log Database")]
    end
    AppServer --> db`,
  en: {
    name: "Green Belt",
    badgeName: "The Subgraph General",
    story: "Coffee consumption is out of control. Corporate headquarters wants to log every cup to verify productivity spikes. You must construct a security architecture that isolates the coffee logs database inside a secure 'HQ Operations' server network using subgraphs and special container nodes!",
    mission: "Create a flowchart with a subgraph named 'HQ Operations'. Inside this subgraph, place a database node shape named 'db' representing the 'Coffee Log Database'. Connect a node 'AppServer' outside the subgraph into the database inside the subgraph.",
    checklist: [
      "Declares flowchart (e.g., graph TD)",
      "Declares a subgraph representing 'HQ Operations'",
      "Defines a cylindrical database node: db[(\"Coffee Log Database\")] (inside the subgraph)",
      "Closes subgraph using: end",
      "Connects: AppServer --> db (cross-boundary connection)"
    ],
    spickzettel: [
      { syntax: "subgraph Title", desc: "Start a subgraph block (ends with 'end')" },
      { syntax: "db[(Database Label)]", desc: "Define a cylindrical database-shaped node named 'db'" }
    ],
    hint: {
      sub: "Sensei says: Isolation is key. You must use a 'subgraph' block and close it with 'end'!",
      subName: "Sensei says: The division of operations is misnamed. Label your subgraph 'HQ Operations'.",
      dbShape: "Sensei says: Standard boxes cannot withstand SQL queries! Define the database node as 'db[(\"Coffee Log Database\")]' inside the subgraph.",
      link: "Sensei says: The App Server is isolated and cannot write logs! Draw a connection from 'AppServer' to 'db'."
    }
  },
  de: {
    name: "Grüner Gürtel",
    badgeName: "Der Subgraph-General",
    story: "Der Kaffeekonsum gerät außer Kontrolle. Die Chefetage möchte jede Tasse protokollieren, um Produktivitätsspitzen zu verifizieren. Entwerfe eine Sicherheitsarchitektur, die die Kaffeeprotokoll-Datenbank in einem sicheren 'HQ Operations'-Netzwerk mittels Subgraphs isoliert!",
    mission: "Erstelle ein Diagramm mit einem Subgraph namens 'HQ Operations'. Platziere in diesem Subgraph einen Datenbank-Knoten namens 'db' mit dem Text 'Coffee Log Database'. Verbinde den Knoten 'AppServer' außerhalb des Subgraphs mit der Datenbank 'db' im Inneren.",
    checklist: [
      "Deklariert das Diagramm (z. B. graph TD)",
      "Deklariert einen Subgraph für 'HQ Operations'",
      "Definiert einen zylindrischen Datenbank-Knoten: db[(\"Coffee Log Database\")]",
      "Schließt den Subgraph mittels: end",
      "Verbindet: AppServer --> db (grenzüberschreitende Verbindung)"
    ],
    spickzettel: [
      { syntax: "subgraph Title", desc: "Startet einen Subgraph-Block (endet mit 'end')" },
      { syntax: "db[(Database Label)]", desc: "Definiert einen zylinderförmigen Datenbank-Knoten namens 'db'" }
    ],
    hint: {
      sub: "Sensei sagt: Isolation ist der Schlüssel. Du musst einen 'subgraph'-Block verwenden und ihn mit 'end' schließen!",
      subName: "Sensei sagt: Der Geschäftsbereich ist falsch benannt. Benenne deinen Subgraph 'HQ Operations'.",
      dbShape: "Sensei sagt: Normale Boxen halten keinen SQL-Abfragen stand! Definiere den Datenbank-Knoten als 'db[(\"Coffee Log Database\")]' im Subgraph.",
      link: "Sensei sagt: Der App Server ist isoliert und kann keine Logs schreiben! Ziehe eine Verbindung von 'AppServer' zu 'db'."
    }
  },
  validate: (code: string): ValidationResult => {
    const clean = code.trim().replace(/\s+/g, '');
    const lower = code.toLowerCase();

    if (!lower.includes("subgraph") || !lower.includes("end")) {
      return { success: false, hintKey: "sub" };
    }

    if (!lower.includes("hq operations")) {
      return { success: false, hintKey: "subName" };
    }

    const hasDbShape = /db\[\(".*?Coffee.*?Log.*?Database.*?"\)\]/i.test(clean) || /db\[\(.*?Coffee.*?Log.*?Database.*?\)\]/i.test(clean);
    if (!hasDbShape) {
      return { success: false, hintKey: "dbShape" };
    }

    const hasCrossLink = hasConnection(clean, 'AppServer', 'db');
    if (!hasCrossLink) {
      return { success: false, hintKey: "link" };
    }

    return { success: true };
  },
  getChecklistStatus: (code: string): boolean[] => {
    const clean = code.trim().replace(/\s+/g, '');
    const lower = code.toLowerCase();
    return [
      lower.includes("graph td") || lower.includes("flowchart td") || lower.includes("graph lr") || lower.includes("flowchart lr"),
      lower.includes("subgraph") && lower.includes("hq operations"),
      /db\[\(".*?Coffee.*?Log.*?Database.*?"\)\]/i.test(clean) || /db\[\(.*?Coffee.*?Log.*?Database.*?\)\]/i.test(clean),
      lower.includes("end"),
      hasConnection(clean, 'AppServer', 'db')
    ];
  }
};
