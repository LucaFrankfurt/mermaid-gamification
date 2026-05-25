import { Challenge, ValidationResult } from './types';

export const level6: Challenge = {
  level: 6,
  beltEmoji: "🟪",
  badgeEmoji: "🌀",
  xpReward: 100,
  starterCode: `stateDiagram-v2
    [*] --> Off
    %% Sensei Hint: Complete the brewing machine state transition loop!
    %% Connect Off to Idle via turn_on.
    %% Connect Idle to Heating via press_brew.
    %% Connect Heating to Dispensing via water_ready.
    %% Connect Dispensing to Idle via cup_full.
`,
  solution: `stateDiagram-v2
    [*] --> Off
    Off --> Idle : turn_on
    Idle --> Heating : press_brew
    Heating --> Dispensing : water_ready
    Dispensing --> Idle : cup_full`,
  en: {
    name: "Purple Belt",
    badgeName: "The State Sensei Shuriken",
    story: "The smart coffee machine in the 4.0 operations room requires a robust state machine in its firmware to prevent overheating. As a Purple Belt, you are tasked with outlining the operational loop of the brewer state machine!",
    mission: "Create a state diagram (`stateDiagram-v2`) showing the transition loops. The machine must turn on into Idle, transition to Heating on pressing brew, advance to Dispensing when hot, and return to Idle when the cup is full.",
    checklist: [
      "Starts with stateDiagram-v2 declaration",
      "Defines transition from start node: [*] --> Off",
      "Off transitions to Idle on 'turn_on'",
      "Idle transitions to Heating on 'press_brew'",
      "Heating transitions to Dispensing on 'water_ready'",
      "Dispensing transitions back to Idle on 'cup_full'"
    ],
    spickzettel: [
      { syntax: "stateDiagram-v2", desc: "Start a State Diagram layout block" },
      { syntax: "[*] --> StateA", desc: "Represent the initial state transition into StateA" },
      { syntax: "StateA --> StateB : action", desc: "Transition from StateA to StateB triggered by action" }
    ],
    hint: {
      decl: "Sensei says: The loop must declare a 'stateDiagram-v2' at the top!",
      initial: "Sensei says: Where does it begin? Make sure the initial state transitions to Off: '[*] --> Off'.",
      turnOn: "Sensei says: The machine remains dark. Connect 'Off' to 'Idle' with action 'turn_on' (e.g. 'Off --> Idle : turn_on').",
      pressBrew: "Sensei says: Pressing the button does nothing! Connect 'Idle' to 'Heating' with action 'press_brew'.",
      waterReady: "Sensei says: Dispensing cold water is unacceptable! Connect 'Heating' to 'Dispensing' with action 'water_ready'.",
      cupFull: "Sensei says: The coffee overflows! Connect 'Dispensing' back to 'Idle' with action 'cup_full' to close the safety loop."
    }
  },
  de: {
    name: "Purpurgürtel",
    badgeName: "Das Status-Sensei-Shuriken",
    story: "Die smarte Kaffeemaschine im Operations-Raum benötigt eine robuste Zustandsmaschine in ihrer Firmware, um Überhitzung zu vermeiden. Als Purpurgürtel bist du dafür verantwortlich, die Firmware-Steuerungslogik zu modellieren!",
    mission: "Erstelle ein Zustandsdiagramm (`stateDiagram-v2`), das den Zustandspfad abbildet: Aus (Off) zu Bereit (Idle), Heizen (Heating), Ausgeben (Dispensing) und zurück zu Bereit (Idle).",
    checklist: [
      "Beginnt mit der stateDiagram-v2 Deklaration",
      "Definiert den Startübergang: [*] --> Off",
      "Off wechselt zu Idle durch 'turn_on'",
      "Idle wechselt zu Heating durch 'press_brew'",
      "Heating wechselt zu Dispensing durch 'water_ready'",
      "Dispensing wechselt zurück zu Idle durch 'cup_full'"
    ],
    spickzettel: [
      { syntax: "stateDiagram-v2", desc: "Startet einen Zustandsgraphen" },
      { syntax: "[*] --> StateA", desc: "Stellt den Anfangszustand nach StateA dar" },
      { syntax: "StateA --> StateB : action", desc: "Zustandsübergang ausgelöst durch Aktion" }
    ],
    hint: {
      decl: "Sensei sagt: Der Pfad muss mit 'stateDiagram-v2' ganz oben deklariert werden!",
      initial: "Sensei sagt: Wo fängt es an? Stelle sicher, dass der Anfangszustand zu 'Off' führt: '[*] --> Off'.",
      turnOn: "Sensei sagt: Die Kaffeemaschine bleibt aus. Verbinde 'Off' mit 'Idle' über die Aktion 'turn_on' (z. B. 'Off --> Idle : turn_on').",
      pressBrew: "Sensei sagt: Knopfdruck bewirkt nichts! Verbinde 'Idle' mit 'Heating' über die Aktion 'press_brew'.",
      waterReady: "Sensei sagt: Kaltes Wasser darf nicht fließen! Verbinde 'Heating' mit 'Dispensing' über 'water_ready'.",
      cupFull: "Sensei sagt: Die Tasse läuft über! Verbinde 'Dispensing' zurück mit 'Idle' über 'cup_full', um die Sicherheitsstufe zu schließen."
    }
  },
  validate: (code: string): ValidationResult => {
    const clean = code.trim().replace(/\s+/g, '');
    const cleanLower = clean.toLowerCase();

    if (!cleanLower.includes("statediagram-v2")) {
      return { success: false, hintKey: "decl" };
    }

    if (!cleanLower.includes("[*]-->off")) {
      return { success: false, hintKey: "initial" };
    }

    const hasTurnOn = /off-->idle:.*?turn_on/i.test(cleanLower) || /off-->idle.*?turn_on/i.test(cleanLower);
    if (!hasTurnOn) return { success: false, hintKey: "turnOn" };

    const hasPressBrew = /idle-->heating:.*?press_brew/i.test(cleanLower) || /idle-->heating.*?press_brew/i.test(cleanLower);
    if (!hasPressBrew) return { success: false, hintKey: "pressBrew" };

    const hasWaterReady = /heating-->dispensing:.*?water_ready/i.test(cleanLower) || /heating-->dispensing.*?water_ready/i.test(cleanLower);
    if (!hasWaterReady) return { success: false, hintKey: "waterReady" };

    const hasCupFull = /dispensing-->idle:.*?cup_full/i.test(cleanLower) || /dispensing-->idle.*?cup_full/i.test(cleanLower);
    if (!hasCupFull) return { success: false, hintKey: "cupFull" };

    return { success: true };
  },
  getChecklistStatus: (code: string): boolean[] => {
    const clean = code.trim().replace(/\s+/g, '');
    const cleanLower = clean.toLowerCase();
    return [
      cleanLower.includes("statediagram-v2"),
      cleanLower.includes("[*]-->off"),
      /off-->idle:.*?turn_on/i.test(cleanLower) || /off-->idle.*?turn_on/i.test(cleanLower),
      /idle-->heating:.*?press_brew/i.test(cleanLower) || /idle-->heating.*?press_brew/i.test(cleanLower),
      /heating-->dispensing:.*?water_ready/i.test(cleanLower) || /heating-->dispensing.*?water_ready/i.test(cleanLower),
      /dispensing-->idle:.*?cup_full/i.test(cleanLower) || /dispensing-->idle.*?cup_full/i.test(cleanLower)
    ];
  }
};
