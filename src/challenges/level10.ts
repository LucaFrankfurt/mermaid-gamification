import { Challenge, ValidationResult } from './types';

export const level10: Challenge = {
  level: 10,
  beltEmoji: "🔴",
  badgeEmoji: "🐉",
  xpReward: 200,
  starterCode: `erDiagram
    NINJA ||--o{ CHALLENGE : completes
    NINJA {
        string name
        int xp
    }
    %% Sensei Hint: Define the CHALLENGE entity attributes and relations!
    %% 1. In CHALLENGE entity, define fields: int level, string badgeEmoji, int xpReward
    %% 2. Connect CHALLENGE to BELT using a one-to-one relation: CHALLENGE ||--|| BELT : unlocks
`,
  solution: `erDiagram
    NINJA ||--o{ CHALLENGE : completes
    NINJA {
        string name
        int xp
    }
    CHALLENGE {
        int level
        string badgeEmoji
        int xpReward
    }
    CHALLENGE ||--|| BELT : unlocks`,
  en: {
    name: "Black Belt - Level 10",
    badgeName: "The Database Overlord Dragon",
    story: "For your ultimate black belt architectural trial, you must design a robust relational database schema to power our Dojo Leaderboard and belt reward system!",
    mission: "Create an Entity Relationship diagram (`erDiagram`) showing relations. Define the `CHALLENGE` entity with attributes: `int level`, `string badgeEmoji`, and `int xpReward`. Connect the `CHALLENGE` to `BELT` using a one-to-one relation: `CHALLENGE ||--|| BELT : unlocks`.",
    checklist: [
      "Starts with erDiagram declaration",
      "Has NINJA ||--o{ CHALLENGE : completes relation",
      "NINJA entity defines attributes name and xp",
      "CHALLENGE entity defines level, badgeEmoji, and xpReward fields",
      "Establishes one-to-one relation: CHALLENGE ||--|| BELT : unlocks"
    ],
    spickzettel: [
      { syntax: "erDiagram", desc: "Start an Entity Relationship Diagram layout block" },
      { syntax: "A ||--o{ B : description", desc: "One-to-many relationship (one A completes zero-to-many B)" },
      { syntax: "A ||--|| B : description", desc: "One-to-one relationship (exactly one A unlocks exactly one B)" },
      { syntax: "A { type attribute }", desc: "Define fields/attributes inside an entity container block" }
    ],
    hint: {
      decl: "Sensei says: The database schema must start with an 'erDiagram' declaration!",
      ninja: "Sensei says: The Ninja leaderboard base fields are missing! Define entity NINJA with name and xp fields.",
      challengeFields: "Sensei says: The CHALLENGE schema is missing key fields! Define attributes: 'int level', 'string badgeEmoji', and 'int xpReward' inside CHALLENGE.",
      ninjaRelation: "Sensei says: The completing connection is missing! Make sure you keep: 'NINJA ||--o{ CHALLENGE : completes'.",
      beltRelation: "Sensei says: The unlocking mechanism is missing! Establish exactly one-to-one relation: 'CHALLENGE ||--|| BELT : unlocks'."
    }
  },
  de: {
    name: "Ultimativer Roter Gürtel",
    badgeName: "Der Datenbank-Overlord-Drache",
    story: "Als krönenden Abschluss deines Ninja-Pfads entwirfst du das relationale Datenbankschema für das gesamte Dojo-Leaderboard-System!",
    mission: "Erstelle ein ER-Diagramm (`erDiagram`). Definiere die Attribute für die Entität `CHALLENGE` (`int level`, `string badgeEmoji`, `int xpReward`) und erstelle eine Eins-zu-Eins-Beziehung zwischen `CHALLENGE` und `BELT` (`CHALLENGE ||--|| BELT : unlocks`).",
    checklist: [
      "Beginnt mit der erDiagram Deklaration",
      "Hat die Beziehung: NINJA ||--o{ CHALLENGE : completes",
      "NINJA Entität definiert name und xp Felder",
      "CHALLENGE Entität definiert level, badgeEmoji und xpReward Felder",
      "Etabliert eine Eins-zu-Eins-Beziehung: CHALLENGE ||--|| BELT : unlocks"
    ],
    spickzettel: [
      { syntax: "erDiagram", desc: "Startet ein ER-Diagramm-Layout" },
      { syntax: "A ||--o{ B : description", desc: "Eins-zu-Viele-Beziehung (ein A führt viele B aus)" },
      { syntax: "A ||--|| B : description", desc: "Eins-zu-Eins-Beziehung (genau ein A schaltet genau ein B frei)" },
      { syntax: "A { typ feld }", desc: "Definiert Attribute/Felder innerhalb einer Entität" }
    ],
    hint: {
      decl: "Sensei sagt: Der Entwurf muss mit einer 'erDiagram' Deklaration ganz oben beginnen!",
      ninja: "Sensei sagt: Die NINJA-Grunddaten fehlen! Trage name und xp innerhalb von NINJA ein.",
      challengeFields: "Sensei sagt: Die CHALLENGE-Entität hat Lücken! Definiere Attribute wie 'int level', 'string badgeEmoji' und 'int xpReward' in CHALLENGE.",
      ninjaRelation: "Sensei sagt: Die ninja-Abschluss-Relation fehlt! Behalte 'NINJA ||--o{ CHALLENGE : completes' bei.",
      beltRelation: "Sensei sagt: Das Freischalten des Gürtels fehlt! Nutze die Eins-zu-Eins-Beziehung: 'CHALLENGE ||--|| BELT : unlocks'."
    }
  },
  validate: (code: string): ValidationResult => {
    const clean = code.trim().replace(/\s+/g, '');
    const cleanLower = clean.toLowerCase();

    if (!cleanLower.includes("erdiagram")) {
      return { success: false, hintKey: "decl" };
    }

    if (!cleanLower.includes("stringname") && !cleanLower.includes("intxp")) {
      if (!cleanLower.includes("name") || !cleanLower.includes("xp")) {
        return { success: false, hintKey: "ninja" };
      }
    }

    if (!cleanLower.includes("intlevel") || !cleanLower.includes("badgeemoji") || !cleanLower.includes("xpreward")) {
      return { success: false, hintKey: "challengeFields" };
    }

    if (!cleanLower.includes("ninja||--o{challenge")) {
      return { success: false, hintKey: "ninjaRelation" };
    }

    if (!cleanLower.includes("challenge||--||belt")) {
      return { success: false, hintKey: "beltRelation" };
    }

    return { success: true };
  },
  getChecklistStatus: (code: string): boolean[] => {
    const clean = code.trim().replace(/\s+/g, '');
    const cleanLower = clean.toLowerCase();
    
    const hasNinjaFields = (cleanLower.includes("stringname") && cleanLower.includes("intxp")) || (cleanLower.includes("name") && cleanLower.includes("xp"));
    
    return [
      cleanLower.includes("erdiagram"),
      cleanLower.includes("ninja||--o{challenge"),
      hasNinjaFields,
      cleanLower.includes("intlevel") && cleanLower.includes("badgeemoji") && cleanLower.includes("xpreward"),
      cleanLower.includes("challenge||--||belt")
    ];
  }
};
