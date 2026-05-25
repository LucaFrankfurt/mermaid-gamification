import { Challenge, ValidationResult } from './types';

export const level7: Challenge = {
  level: 7,
  beltEmoji: "🟧",
  badgeEmoji: "📐",
  xpReward: 100,
  starterCode: `classDiagram
    class Ninja {
        +String name
        +int xp
        +gainXp(amount)
    }
    %% Sensei Hint: Define the Sensei class and relations!
    %% 1. Sensei inherits from Ninja (Ninja <|-- Sensei)
    %% 2. Define Sensei methods: +teachMastery() and +gradeScroll()
    %% 3. Show that Ninja has a Belt class: Ninja --> Belt : wears
`,
  solution: `classDiagram
    class Ninja {
        +String name
        +int xp
        +gainXp(amount)
    }
    class Sensei {
        +teachMastery()
        +gradeScroll()
    }
    Ninja <|-- Sensei
    Ninja --> Belt : wears`,
  en: {
    name: "Orange Belt",
    badgeName: "The Object Master Scroll",
    story: "To scale our training dojo platform, we must refactor our spaghetti object model into a sleek, clean, object-oriented UML diagram. This represents the software architecture for our office ninja roster!",
    mission: "Create a class diagram (`classDiagram`) declaring that `Sensei` inherits from `Ninja` (`Ninja <|-- Sensei`), defining Sensei's methods (`teachMastery()` and `gradeScroll()`), and drawing a directed association from `Ninja` to `Belt` (`Ninja --> Belt`).",
    checklist: [
      "Starts with classDiagram declaration",
      "Sensei inherits from Ninja: Ninja <|-- Sensei",
      "Sensei has method: teachMastery()",
      "Sensei has method: gradeScroll()",
      "Ninja has directed association to Belt: Ninja --> Belt"
    ],
    spickzettel: [
      { syntax: "classDiagram", desc: "Start a Class Diagram layout block" },
      { syntax: "class ClassName", desc: "Define a class with ClassName" },
      { syntax: "A <|-- B", desc: "Inheritance relation (A is the superclass of B)" },
      { syntax: "A --> B", desc: "Directed association showing B is a field/part of A" }
    ],
    hint: {
      decl: "Sensei says: You must declare a 'classDiagram' at the top of the timeline!",
      inherit: "Sensei says: The family bond is broken. Sensei must inherit from Ninja: 'Ninja <|-- Sensei'.",
      teach: "Sensei says: A Sensei who cannot teach is but an apprentice! Add method '+teachMastery()' or 'teachMastery()' to Sensei.",
      grade: "Sensei says: The scroll checker needs grades! Add method '+gradeScroll()' or 'gradeScroll()' to Sensei.",
      association: "Sensei says: A Ninja is beltless! Show the relation that Ninja wears Belt: 'Ninja --> Belt'."
    }
  },
  de: {
    name: "Orangener Gürtel",
    badgeName: "Die Objekt-Meister-Schriftrolle",
    story: "Um unsere Trainingsplattform sauberer zu codieren, müssen wir das alte Spaghetti-Datenmodell in ein sauberes objektorientiertes UML-Diagramm überführen! Dies stellt die Gesamtstruktur für unsere Ränge dar.",
    mission: "Erstelle ein Klassendiagramm (`classDiagram`), in dem die Klasse `Sensei` von `Ninja` erbt (`Ninja <|-- Sensei`), Senseis Methoden definiert sind (`teachMastery()` und `gradeScroll()`) und eine gerichtete Assoziation von `Ninja` zu `Belt` verläuft (`Ninja --> Belt`).",
    checklist: [
      "Beginnt mit der classDiagram Deklaration",
      "Sensei erbt von Ninja: Ninja <|-- Sensei",
      "Sensei hat die Methode: teachMastery()",
      "Sensei hat die Methode: gradeScroll()",
      "Ninja hat eine gerichtete Assoziation zu Belt: Ninja --> Belt"
    ],
    spickzettel: [
      { syntax: "classDiagram", desc: "Startet ein Klassendiagramm-Layout" },
      { syntax: "class ClassName", desc: "Definiert eine Klasse namens ClassName" },
      { syntax: "A <|-- B", desc: "Vererbung (B erbt von Basisklasse A)" },
      { syntax: "A --> B", desc: "Gerichtete Assoziation von A nach B" }
    ],
    hint: {
      decl: "Sensei sagt: Du musst ein 'classDiagram' ganz oben in deiner Schriftrolle deklarieren!",
      inherit: "Sensei sagt: Der Stammbaum stimmt nicht. Sensei muss von Ninja erben: 'Ninja <|-- Sensei'.",
      teach: "Sensei sagt: Ein Meister, der nicht lehren kann, ist kein Sensei! Füge die Methode '+teachMastery()' oder 'teachMastery()' der Klasse Sensei hinzu.",
      grade: "Sensei sagt: Der Prüfer braucht Ergebnisse! Füge die Methode '+gradeScroll()' oder 'gradeScroll()' der Klasse Sensei hinzu.",
      association: "Sensei sagt: Der Ninja trägt keinen Gürtel! Zeichne die Verbindung von Ninja zu Belt: 'Ninja --> Belt'."
    }
  },
  validate: (code: string): ValidationResult => {
    const clean = code.trim().replace(/\s+/g, '');
    const cleanLower = clean.toLowerCase();

    if (!cleanLower.includes("classdiagram")) {
      return { success: false, hintKey: "decl" };
    }

    if (!cleanLower.includes("ninja<|--sensei") && !cleanLower.includes("sensei--|>ninja")) {
      return { success: false, hintKey: "inherit" };
    }

    if (!cleanLower.includes("teachmastery")) {
      return { success: false, hintKey: "teach" };
    }

    if (!cleanLower.includes("gradescroll")) {
      return { success: false, hintKey: "grade" };
    }

    if (!cleanLower.includes("ninja-->belt")) {
      return { success: false, hintKey: "association" };
    }

    return { success: true };
  },
  getChecklistStatus: (code: string): boolean[] => {
    const clean = code.trim().replace(/\s+/g, '');
    const cleanLower = clean.toLowerCase();
    return [
      cleanLower.includes("classdiagram"),
      cleanLower.includes("ninja<|--sensei") || cleanLower.includes("sensei--|>ninja"),
      cleanLower.includes("teachmastery"),
      cleanLower.includes("gradescroll"),
      cleanLower.includes("ninja-->belt")
    ];
  }
};
