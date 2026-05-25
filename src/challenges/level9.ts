import { Challenge, ValidationResult } from './types';

export const level9: Challenge = {
  level: 9,
  beltEmoji: "🟫",
  badgeEmoji: "📊",
  xpReward: 100,
  starterCode: `pie title Dojo Coffee Beans Consumption
    "Arabica" : 55
    "Robusta" : 35
    %% Sensei Hint: Complete the pie chart!
    %% Add "Liberica" consumption value of 10.
    %% Make sure it totals 100%!
`,
  solution: `pie title Dojo Coffee Beans Consumption
    "Arabica" : 55
    "Robusta" : 35
    "Liberica" : 10`,
  en: {
    name: "Brown Belt",
    badgeName: "The Data Daimyo Fan",
    story: "The local office manager wants to purchase bean supplies for the next quarter. To justify the budget to the finance Daimyo, you must produce a beautiful pie-chart visual breakdown of our bean type consumption!",
    mission: "Create a pie chart (`pie`) with title 'Dojo Coffee Beans Consumption'. Declare values: Arabica at 55, Robusta at 35, and Liberica at 10.",
    checklist: [
      "Starts with pie declaration",
      "Sets title: Dojo Coffee Beans Consumption",
      "Defines Arabica slice at 55",
      "Defines Robusta slice at 35",
      "Defines Liberica slice at 10 (making it 100% total)"
    ],
    spickzettel: [
      { syntax: "pie", desc: "Start a Pie Chart layout block" },
      { syntax: "pie title My Title", desc: "Start a Pie Chart with a custom header title" },
      { syntax: "\"Label\" : Value", desc: "Add a named slice segment with its numeric value" }
    ],
    hint: {
      decl: "Sensei says: The scroll must begin with the 'pie' diagram style!",
      title: "Sensei says: The title must match: 'pie title Dojo Coffee Beans Consumption'!",
      arabica: "Sensei says: Arabica is the baseline! Add '\"Arabica\" : 55' to the slice list.",
      robusta: "Sensei says: Robusta supplies the punch! Add '\"Robusta\" : 35' to the list.",
      liberica: "Sensei says: The calculations don't sum to 100%! Verify you have added '\"Liberica\" : 10' as the final slice."
    }
  },
  de: {
    name: "Brauner Gürtel",
    badgeName: "Der Daten-Daimyo-Fächer",
    story: "Der Büro-Daimyo verlangt eine verständliche Übersicht über den Kaffeebohnenverbrauch im gesamten Dojo, um den Einkaufsetat für das nächste Quartal zu genehmigen. Ein Kreisdiagramm ist perfekt dafür!",
    mission: "Erstelle ein Tortendiagramm (`pie` mit Titel `Dojo Coffee Beans Consumption`). Trage die Werte für Arabica (55), Robusta (35) und Liberica (10) ein.",
    checklist: [
      "Beginnt mit der pie Deklaration",
      "Setzt den Titel: Dojo Coffee Beans Consumption",
      "Setzt die Arabica-Portion auf 55",
      "Setzt die Robusta-Portion auf 35",
      "Setzt die Liberica-Portion auf 10 (um 100% vollzumachen)"
    ],
    spickzettel: [
      { syntax: "pie", desc: "Startet ein Kreisdiagramm-Layout" },
      { syntax: "pie title Mein Titel", desc: "Startet ein Kreisdiagramm mit einem Titel" },
      { syntax: "\"Label\" : Wert", desc: "Fügt ein beschriftetes Segment mit Zahlenwert hinzu" }
    ],
    hint: {
      decl: "Sensei sagt: Die Deklaration 'pie' ganz oben wird benötigt!",
      title: "Sensei sagt: Der Titel ist inkorrekt! Nutze: 'pie title Dojo Coffee Beans Consumption'.",
      arabica: "Sensei sagt: Arabica bildet das Fundament! Füge '\"Arabica\" : 55' hinzu.",
      robusta: "Sensei sagt: Robusta gibt die nötige Würze! Füge '\"Robusta\" : 35' hinzu.",
      liberica: "Sensei sagt: Die Bilanz stimmt nicht! Trage '\"Liberica\" : 10' als Bohnensorte ein, um 100% zu erzielen."
    }
  },
  validate: (code: string): ValidationResult => {
    const clean = code.trim().replace(/\s+/g, '');
    const cleanLower = clean.toLowerCase();

    if (!cleanLower.includes("pie")) {
      return { success: false, hintKey: "decl" };
    }

    if (!cleanLower.includes("dojocoffeebeansconsumption")) {
      return { success: false, hintKey: "title" };
    }

    if (!cleanLower.includes("\"arabica\":55") && !cleanLower.includes("arabica:55") && !cleanLower.includes("'arabica':55")) {
      return { success: false, hintKey: "arabica" };
    }

    if (!cleanLower.includes("\"robusta\":35") && !cleanLower.includes("robusta:35") && !cleanLower.includes("'robusta':35")) {
      return { success: false, hintKey: "robusta" };
    }

    if (!cleanLower.includes("\"liberica\":10") && !cleanLower.includes("liberica:10") && !cleanLower.includes("'liberica':10")) {
      return { success: false, hintKey: "liberica" };
    }

    return { success: true };
  },
  getChecklistStatus: (code: string): boolean[] => {
    const clean = code.trim().replace(/\s+/g, '');
    const cleanLower = clean.toLowerCase();
    return [
      cleanLower.includes("pie"),
      cleanLower.includes("dojocoffeebeansconsumption"),
      cleanLower.includes("\"arabica\":55") || cleanLower.includes("arabica:55") || cleanLower.includes("'arabica':55"),
      cleanLower.includes("\"robusta\":35") || cleanLower.includes("robusta:35") || cleanLower.includes("'robusta':35"),
      cleanLower.includes("\"liberica\":10") || cleanLower.includes("liberica:10") || cleanLower.includes("'liberica':10")
    ];
  }
};
