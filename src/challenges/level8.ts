import { Challenge, ValidationResult } from './types';

export const level8: Challenge = {
  level: 8,
  beltEmoji: "🌸",
  badgeEmoji: "🎭",
  xpReward: 100,
  starterCode: `journey
    title A Ninja Morning Routine
    section Wake Up
      Get out of bed: 3: Ninja
      %% Sensei Hint: Map the journey of ordering and sipping coffee!
      %% 1. Add task "Walk to Dojo" under section "Wake Up" with emotion score 4 for Ninja
      %% 2. Add section "Caffeine Access"
      %% 3. Add task "Order Double Shot" with emotion score 1 for Ninja
      %% 4. Add task "Drink Nectar of Gods" with emotion score 5 for Ninja, Sensei
`,
  solution: `journey
    title A Ninja Morning Routine
    section Wake Up
      Get out of bed: 3: Ninja
      Walk to Dojo: 4: Ninja
    section Caffeine Access
      Order Double Shot: 1: Ninja
      Drink Nectar of Gods: 5: Ninja, Sensei`,
  en: {
    name: "Pink Belt",
    badgeName: "The Empathy Explorer Fan",
    story: "To build a healthy, positive Dojo workplace culture, we need to understand the exact, unfiltered emotional experience of our trainees. As a Pink Belt, you will map out the morning timeline and trace how energy levels spike with caffeine access!",
    mission: "Create a user journey diagram (`journey`) representing the morning routine. Ensure the task 'Walk to Dojo' has emotion 4, introduce section 'Caffeine Access', add task 'Order Double Shot' with emotion 1, and add task 'Drink Nectar of Gods' with emotion 5 for both Ninja and Sensei.",
    checklist: [
      "Starts with journey declaration",
      "Has task 'Walk to Dojo' with score 4 under 'Wake Up'",
      "Defines section 'Caffeine Access'",
      "Has task 'Order Double Shot' with score 1 for 'Ninja'",
      "Has task 'Drink Nectar of Gods' with score 5 for 'Ninja' and 'Sensei'"
    ],
    spickzettel: [
      { syntax: "journey", desc: "Start a User Journey Diagram layout block" },
      { syntax: "title Description", desc: "Define a descriptive title for the journey" },
      { syntax: "section Title", desc: "Group subsequent tasks into a logical block" },
      { syntax: "Task: Score: User1, User2", desc: "Define task name, numeric emotion score (1 to 5), and stakeholder list" }
    ],
    hint: {
      decl: "Sensei says: The scroll must start with a 'journey' declaration!",
      walk: "Sensei says: The walk is missing or miscalculated! Add 'Walk to Dojo: 4: Ninja' inside the Wake Up section.",
      section: "Sensei says: Where is the gateway to liquid energy? Define a section named 'Caffeine Access'.",
      order: "Sensei says: The long queue is frustrating! Add task 'Order Double Shot: 1: Ninja' under Caffeine Access.",
      drink: "Sensei says: Savoring is the ultimate step! Verify you have 'Drink Nectar of Gods: 5: Ninja, Sensei' to complete the loop."
    }
  },
  de: {
    name: "Rosa Gürtel",
    badgeName: "Der Empathie-Entdecker-Fächer",
    story: "Um eine gesunde und produktive Dojo-Kultur zu fördern, müssen wir die emotionalen Höhen und Tiefen unserer Lehrlinge genau verstehen! Als rosa Gürtel zeichnest du die emotionale Reise zum morgendlichen Espresso nach.",
    mission: "Erstelle ein User-Journey-Diagramm (`journey`). Stelle sicher, dass die Aufgabe 'Walk to Dojo' mit Gefühlsstufe 4 eingetragen ist, deklariere die Sektion 'Caffeine Access', füge die Aufgabe 'Order Double Shot' mit Stufe 1 hinzu und schließe mit 'Drink Nectar of Gods' (Stufe 5 für Ninja und Sensei) ab.",
    checklist: [
      "Beginnt mit der journey Deklaration",
      "Hat Aufgabe 'Walk to Dojo' mit Stufe 4 unter 'Wake Up'",
      "Definiert Sektion 'Caffeine Access'",
      "Hat Aufgabe 'Order Double Shot' mit Stufe 1 für 'Ninja'",
      "Hat Aufgabe 'Drink Nectar of Gods' mit Stufe 5 für 'Ninja' und 'Sensei'"
    ],
    spickzettel: [
      { syntax: "journey", desc: "Startet ein User-Journey-Diagramm" },
      { syntax: "title Beschreibung", desc: "Setzt den Titel der User Journey" },
      { syntax: "section Titel", desc: "Gruppiert folgende Aufgaben in eine Sektion" },
      { syntax: "Aufgabe: Wert: Nutzer1, Nutzer2", desc: "Setzt Aufgabe, emotionale Bewertung (1 bis 5) und betroffene Nutzer" }
    ],
    hint: {
      decl: "Sensei sagt: Die Schriftrolle muss mit der Deklaration 'journey' ganz oben beginnen!",
      walk: "Sensei sagt: Der Weg zum Dojo fehlt oder hat den falschen Wert! Füge 'Walk to Dojo: 4: Ninja' in der Sektion 'Wake Up' hinzu.",
      section: "Sensei sagt: Wo ist die Pforte zur Kaffeemaschine? Definiere einen Abschnitt namens 'Caffeine Access'.",
      order: "Sensei sagt: Das Anstehen in der Warteschlange deprimiert! Füge die Aufgabe 'Order Double Shot: 1: Ninja' in der Sektion 'Caffeine Access' hinzu.",
      drink: "Sensei sagt: Die göttliche Tasse Espresso fehlt! Stelle sicher, dass du 'Drink Nectar of Gods: 5: Ninja, Sensei' am Ende einträgst."
    }
  },
  validate: (code: string): ValidationResult => {
    const clean = code.trim().replace(/\s+/g, '');
    const cleanLower = clean.toLowerCase();

    if (!cleanLower.includes("journey")) {
      return { success: false, hintKey: "decl" };
    }

    if (!cleanLower.includes("walktodojo:4:ninja")) {
      return { success: false, hintKey: "walk" };
    }

    if (!cleanLower.includes("caffeineaccess")) {
      return { success: false, hintKey: "section" };
    }

    if (!cleanLower.includes("orderdoubleshot:1:ninja")) {
      return { success: false, hintKey: "order" };
    }

    if (!cleanLower.includes("drinknectarofgods:5:ninja,sensei") && !cleanLower.includes("drinknectarofgods:5:sensei,ninja")) {
      return { success: false, hintKey: "drink" };
    }

    return { success: true };
  },
  getChecklistStatus: (code: string): boolean[] => {
    const clean = code.trim().replace(/\s+/g, '');
    const cleanLower = clean.toLowerCase();
    return [
      cleanLower.includes("journey"),
      cleanLower.includes("walktodojo:4:ninja"),
      cleanLower.includes("caffeineaccess"),
      cleanLower.includes("orderdoubleshot:1:ninja"),
      cleanLower.includes("drinknectarofgods:5:ninja,sensei") || cleanLower.includes("drinknectarofgods:5:sensei,ninja")
    ];
  }
};
