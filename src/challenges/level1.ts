import { Challenge, ValidationResult, hasConnection } from './types';

export const level1: Challenge = {
  level: 1,
  beltEmoji: "⬜",
  badgeEmoji: "☕",
  xpReward: 100,
  starterCode: `graph TD
    Start[Thirsty Employee Arrives] --> PressButton[Press Coffee Button]
    %% Sensei Hint: Complete the chain below!
    %% Make PressButton point to FillCup, and FillCup point to Enjoy.
`,
  solution: `graph TD
    Start[Thirsty Employee Arrives] --> PressButton[Press Coffee Button]
    PressButton --> FillCup[Cup Fills with Espresso]
    FillCup --> Enjoy[Sip with Corporate Satisfaction]`,
  en: {
    name: "White Belt",
    badgeName: "The Coffee Whiz Shuriken",
    story: "The legendary coffee machine on the 3rd floor is governed by an ancient, unwritten, and highly volatile protocol. If a thirsty employee does not follow the correct sequence, the machine screeches and triggers a paper jam in the CFO's printer down the hall. Let's write a simple top-down flowchart to document the Happy Path!",
    mission: "Create a simple top-down flowchart (`graph TD` or `flowchart TD`) representing the Coffee Machine Protocol. Make sure it contains these exact node connections: Start ➔ PressButton ➔ FillCup ➔ Enjoy.",
    checklist: [
      "Starts with flowchart declaration: graph TD or flowchart TD",
      "Defines node 'Start' with label: 'Thirsty Employee Arrives'",
      "Defines node 'PressButton' with label: 'Press Coffee Button'",
      "Defines node 'FillCup' with label: 'Cup Fills with Espresso'",
      "Defines node 'Enjoy' with label: 'Sip with Corporate Satisfaction'",
      "Connects: Start --> PressButton",
      "Connects: PressButton --> FillCup",
      "Connects: FillCup --> Enjoy"
    ],
    spickzettel: [
      { syntax: "graph TD", desc: "Start a top-down flowchart layout" },
      { syntax: "A[My Label]", desc: "Define a box node with ID 'A' and custom text label" },
      { syntax: "A --> B", desc: "Draw a simple directional arrow from node A to node B" }
    ],
    hint: {
      decl: "Sensei says: Your scroll must begin by declaring the flowchart style, such as 'graph TD' (Top-Down)!",
      startNode: "Sensei says: The legend is incomplete! Your flowchart must start with a node named 'Start' labeled 'Thirsty Employee Arrives'.",
      pressNode: "Sensei says: The physical act is missing! Verify you have a node named 'PressButton' labeled 'Press Coffee Button'.",
      fillNode: "Sensei says: The golden liquid flows not! Add a node named 'FillCup' labeled 'Cup Fills with Espresso'.",
      enjoyNode: "Sensei says: Where is the reward? Add a terminal node named 'Enjoy' labeled 'Sip with Corporate Satisfaction'.",
      link1: "Sensei says: The path is broken. Make sure 'Start' flows into 'PressButton' using the simple arrow '-->'.",
      link2: "Sensei says: Water, beans, but no transfer! Connect 'PressButton' directly to 'FillCup'.",
      link3: "Sensei says: You are withholding happiness. Connect 'FillCup' directly to 'Enjoy' to conclude the protocol."
    }
  },
  de: {
    name: "Weißer Gürtel",
    badgeName: "Das Kaffee-Genie-Shuriken",
    story: "Die legendäre Kaffeemaschine im 3. Stock wird von einem uralten, ungeschriebenen und höchst instabilen Protokoll geregelt. Wenn ein durstiger Mitarbeiter die richtige Reihenfolge nicht einhält, kreischt die Maschine schrill und löst einen Papierstau im Drucker des CFOs aus. Schreiben wir ein einfaches Top-Down-Flussdiagramm für den Happy Path!",
    mission: "Erstelle ein einfaches Flussdiagramm von oben nach unten (`graph TD` oder `flowchart TD`), das das Kaffeemaschinen-Protokoll darstellt. Stelle sicher, dass es genau diese Verbindungen enthält: Start ➔ PressButton ➔ FillCup ➔ Enjoy.",
    checklist: [
      "Beginnt mit der Flussdiagramm-Deklaration: graph TD oder flowchart TD",
      "Definiert Knoten 'Start' mit Label: 'Thirsty Employee Arrives'",
      "Definiert Knoten 'PressButton' mit Label: 'Press Coffee Button'",
      "Definiert Knoten 'FillCup' mit Label: 'Cup Fills with Espresso'",
      "Definiert Knoten 'Enjoy' mit Label: 'Sip with Corporate Satisfaction'",
      "Verbindet: Start --> PressButton",
      "Verbindet: PressButton --> FillCup",
      "Verbindet: FillCup --> Enjoy"
    ],
    spickzettel: [
      { syntax: "graph TD", desc: "Startet ein Flussdiagramm von oben nach unten" },
      { syntax: "A[My Label]", desc: "Definiert Box-Knoten mit ID 'A' und Beschriftungstext" },
      { syntax: "A --> B", desc: "Zeichnet einen einfachen Richtungspfeil von Knoten A zu B" }
    ],
    hint: {
      decl: "Sensei sagt: Deine Schriftrolle muss mit der Deklaration des Flussdiagramm-Stils beginnen, z. B. 'graph TD' (von oben nach unten)!",
      startNode: "Sensei sagt: Die Legende ist unvollständig! Dein Diagramm muss mit einem Knoten namens 'Start' und der Beschriftung 'Thirsty Employee Arrives' beginnen.",
      pressNode: "Sensei sagt: Die physische Aktion fehlt! Stelle sicher, dass du einen Knoten namens 'PressButton' mit dem Label 'Press Coffee Button' hast.",
      fillNode: "Sensei sagt: Das flüssige Gold fließt nicht! Füge einen Knoten namens 'FillCup' mit dem Label 'Cup Fills with Espresso' hinzu.",
      enjoyNode: "Sensei sagt: Wo bleibt die Belohnung? Füge einen Endknoten namens 'Enjoy' mit dem Label 'Sip with Corporate Satisfaction' hinzu.",
      link1: "Sensei sagt: Der Pfad ist unterbrochen. Verbinde 'Start' direkt mit 'PressButton' über den Pfeil '-->'.",
      link2: "Sensei sagt: Wasser und Bohnen sind da, aber kein Fluss! Verbinde 'PressButton' direkt mit 'FillCup'.",
      link3: "Sensei sagt: Du verweigerst dem Mitarbeiter das Glückgefühl! Verbinde 'FillCup' direkt mit 'Enjoy', um das Protokoll abzuschließen."
    }
  },
  validate: (code: string): ValidationResult => {
    const clean = code.trim().replace(/\s+/g, '');
    const lower = code.toLowerCase();
    
    if (!lower.includes("graph td") && !lower.includes("flowchart td") && !lower.includes("graph lr") && !lower.includes("flowchart lr")) {
      return { success: false, hintKey: "decl" };
    }

    if (!code.includes("Start") || !lower.includes("thirsty employee arrives")) {
      return { success: false, hintKey: "startNode" };
    }
    if (!code.includes("PressButton") || !lower.includes("press coffee button")) {
      return { success: false, hintKey: "pressNode" };
    }
    if (!code.includes("FillCup") || !lower.includes("cup fills with espresso")) {
      return { success: false, hintKey: "fillNode" };
    }
    if (!code.includes("Enjoy") || !lower.includes("sip with corporate satisfaction")) {
      return { success: false, hintKey: "enjoyNode" };
    }

    const hasLink1 = hasConnection(clean, 'Start', 'PressButton');
    const hasLink2 = hasConnection(clean, 'PressButton', 'FillCup');
    const hasLink3 = hasConnection(clean, 'FillCup', 'Enjoy');

    if (!hasLink1) return { success: false, hintKey: "link1" };
    if (!hasLink2) return { success: false, hintKey: "link2" };
    if (!hasLink3) return { success: false, hintKey: "link3" };

    return { success: true };
  },
  getChecklistStatus: (code: string): boolean[] => {
    const clean = code.trim().replace(/\s+/g, '');
    const lower = code.toLowerCase();
    return [
      lower.includes("graph td") || lower.includes("flowchart td") || lower.includes("graph lr") || lower.includes("flowchart lr"),
      code.includes("Start") && lower.includes("thirsty employee arrives"),
      code.includes("PressButton") && lower.includes("press coffee button"),
      code.includes("FillCup") && lower.includes("cup fills with espresso"),
      code.includes("Enjoy") && lower.includes("sip with corporate satisfaction"),
      hasConnection(clean, 'Start', 'PressButton'),
      hasConnection(clean, 'PressButton', 'FillCup'),
      hasConnection(clean, 'FillCup', 'Enjoy')
    ];
  }
};
