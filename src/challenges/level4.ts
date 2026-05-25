import { Challenge, ValidationResult } from './types';

export const level4: Challenge = {
  level: 4,
  beltEmoji: "🟦",
  badgeEmoji: "💬",
  xpReward: 100,
  starterCode: `sequenceDiagram
    participant Employee
    participant HR_Gateway
    participant Espresso_API
    
    %% Sensei Hint: Map out the communication sequence!
    %% 1. Employee sends solid arrow (->>) to HR_Gateway: "Request Email Access"
    %% 2. HR_Gateway sends solid arrow to Espresso_API: "Has employee had espresso?"
    %% 3. Espresso_API replies with dotted arrow (-->>) to HR_Gateway: "Yes, double shot"
    %% 4. HR_Gateway replies with dotted arrow to Employee: "Access Granted"
`,
  solution: `sequenceDiagram
    participant Employee
    participant HR_Gateway
    participant Espresso_API
    Employee->>HR_Gateway: Request Email Access
    HR_Gateway->>Espresso_API: Has employee had espresso?
    Espresso_API-->>HR_Gateway: Yes, double shot
    HR_Gateway-->>Employee: Access Granted`,
  en: {
    name: "Blue Belt",
    badgeName: "The Sequence Choreographer",
    story: "The microservice revolution is here! We are automating a security handshake: the Corporate Email server will query the Smart Coffee Machine API. If the employee has had their mandatory morning double-shot espresso, they are allowed access to the server. If not, they are locked out! Let us model this dance with a sequence diagram.",
    mission: "Create a sequence diagram (`sequenceDiagram`) demonstrating the coffee-email handshake. You must show the sequence of calls between Employee, HR_Gateway, and Espresso_API.",
    checklist: [
      "Starts with sequenceDiagram",
      "Defines participants: Employee, HR_Gateway, Espresso_API",
      "Employee asks HR_Gateway: 'Request Email Access'",
      "HR_Gateway queries Espresso_API: 'Has employee had espresso?'",
      "Espresso_API replies to HR_Gateway: 'Yes, double shot'",
      "HR_Gateway responds to Employee: 'Access Granted'"
    ],
    spickzettel: [
      { syntax: "sequenceDiagram", desc: "Start a Sequence Diagram layout" },
      { syntax: "A ->> B: Message", desc: "Synchronous solid-arrow message from A to B" },
      { syntax: "B -->> A: Response", desc: "Asynchronous dotted-arrow response from B back to A" }
    ],
    hint: {
      decl: "Sensei says: The flowchart scroll is finished. You must now use a 'sequenceDiagram' declaration at the top!",
      actors: "Sensei says: Actors are missing from the stage. Ensure you have the participants 'Employee', 'HR_Gateway', and 'Espresso_API'.",
      step1: "Sensei says: The employee has not initiated the protocol! Send a message: 'Employee ->> HR_Gateway: Request Email Access'.",
      step2: "Sensei says: The HR Gateway is neglecting checks! It must query the Espresso_API: 'HR_Gateway ->> Espresso_API: Has employee had espresso?'.",
      step3: "Sensei says: The API has gone silent. Make Espresso_API reply with a dotted arrow: 'Espresso_API -->> HR_Gateway: Yes, double shot'.",
      step4: "Sensei says: The employee is left in suspense! Have the gateway grant access: 'HR_Gateway -->> Employee: Access Granted'."
    }
  },
  de: {
    name: "Blauer Gürtel",
    badgeName: "Der Sequenz-Choreograf",
    story: "Die Microservice-Revolution ist da! Wir automatisieren einen Sicherheits-Handshake: Der E-Mail-Server fragt die smarte Kaffeemaschinen-API ab. Wenn der Mitarbeiter seinen doppelten Espresso hatte, erhält er Zugriff. Wenn nicht, wird er ausgesperrt! Stellen wir diesen Tanz in einem Sequenzdiagramm dar.",
    mission: "Erstelle ein Sequenzdiagramm (`sequenceDiagram`), das den Handshake veranschaulicht. Zeige die Kommunikationskette zwischen Employee, HR_Gateway und Espresso_API.",
    checklist: [
      "Beginnt mit sequenceDiagram",
      "Definiert Akteure: Employee, HR_Gateway, Espresso_API",
      "Employee fragt HR_Gateway: 'Request Email Access'",
      "HR_Gateway fragt Espresso_API: 'Has employee had espresso?'",
      "Espresso_API antwortet HR_Gateway: 'Yes, double shot'",
      "HR_Gateway antwortet Employee: 'Access Granted'"
    ],
    spickzettel: [
      { syntax: "sequenceDiagram", desc: "Startet ein Sequenzdiagramm-Layout" },
      { syntax: "A ->> B: Message", desc: "Synchroner Aufruf mit durchgezogener Linie von A zu B" },
      { syntax: "B -->> A: Response", desc: "Asynchrone Antwort mit gestrichelter Linie von B zu A" }
    ],
    hint: {
      decl: "Sensei sagt: Die Flussdiagramm-Schriftrolle ist beendet. Deklariere nun ein 'sequenceDiagram' ganz oben!",
      actors: "Sensei sagt: Akteure fehlen auf der Bühne! Stelle sicher, dass die Teilnehmer 'Employee', 'HR_Gateway' und 'Espresso_API' vorhanden sind.",
      step1: "Sensei sagt: Der Mitarbeiter hat das Protokoll nicht gestartet! Sende: 'Employee ->> HR_Gateway: Request Email Access'.",
      step2: "Sensei sagt: Das HR-Gateway vernachlässigt die Pflichten! Frage die API: 'HR_Gateway ->> Espresso_API: Has employee had espresso?'.",
      step3: "Sensei sagt: Die API schweigt! Lass Espresso_API gestrichelt antworten: 'Espresso_API -->> HR_Gateway: Yes, double shot'.",
      step4: "Sensei sagt: Der Mitarbeiter wird im Dunkeln gelassen! Gewähre Zugriff: 'HR_Gateway -->> Employee: Access Granted'."
    }
  },
  validate: (code: string): ValidationResult => {
    const clean = code.trim().replace(/\s+/g, '');
    const lower = code.toLowerCase();

    if (!lower.includes("sequencediagram")) {
      return { success: false, hintKey: "decl" };
    }

    if (!code.includes("Employee") || !code.includes("HR_Gateway") || !code.includes("Espresso_API")) {
      return { success: false, hintKey: "actors" };
    }

    const hasStep1 = /Employee->+>HR_Gateway:.*?Request.*?Email.*?Access/i.test(clean);
    if (!hasStep1) return { success: false, hintKey: "step1" };

    const hasStep2 = /HR_Gateway->+>Espresso_API:.*?had.*?espresso/i.test(clean);
    if (!hasStep2) return { success: false, hintKey: "step2" };

    const hasStep3 = /Espresso_API--+>>?HR_Gateway:.*?double.*?shot/i.test(clean);
    if (!hasStep3) return { success: false, hintKey: "step3" };

    const hasStep4 = /HR_Gateway--+>>?Employee:.*?Access.*?Granted/i.test(clean) || /HR_Gateway->+>Employee:.*?Access.*?Granted/i.test(clean);
    if (!hasStep4) return { success: false, hintKey: "step4" };

    return { success: true };
  },
  getChecklistStatus: (code: string): boolean[] => {
    const clean = code.trim().replace(/\s+/g, '');
    const lower = code.toLowerCase();
    return [
      lower.includes("sequencediagram"),
      code.includes("Employee") && code.includes("HR_Gateway") && code.includes("Espresso_API"),
      /Employee->+>HR_Gateway:.*?Request.*?Email.*?Access/i.test(clean),
      /HR_Gateway->+>Espresso_API:.*?had.*?espresso/i.test(clean),
      /Espresso_API--+>>?HR_Gateway:.*?double.*?shot/i.test(clean),
      /HR_Gateway--+>>?Employee:.*?Access.*?Granted/i.test(clean) || /HR_Gateway->+>Employee:.*?Access.*?Granted/i.test(clean)
    ];
  }
};
