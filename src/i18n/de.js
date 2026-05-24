// German translation dictionary for Mermaid Ninja Dojo
export default {
  // Statische UI-Kopien
  dojoTitle: "Mermaid-Ninja-Dojo",
  dojoSub: "Meistere Text-zu-Diagramm-Erstellung in unserem sandkastenartigen, mausfreien Tempel.",
  beltLabel: "Gürtelstatus",
  totalXp: "Gesamt-XP",
  unlockedBadges: "Errungene Shuriken",
  journeyTab: "Ninja-Pfad",
  sandboxTab: "Freier Sandkasten",
  referenceTab: "Dojo-Referenzrolle",
  curriculumHeader: "Lehrplan-Fortschritt",
  missionHeader: "Deine Mission:",
  gradeReqs: "Bedingungen für Bestehen:",
  scrollCheatSheet: "Spickzettel für Schriftrolle:",
  syntaxHeader: "Syntax",
  resultHeader: "Ergebnis",
  editorHeader: "Code-Editor-Arbeitsbereich",
  resetBtn: "Zurücksetzen",
  copyCodeBtn: "Code kopieren",
  gradeSubmitBtn: "Code prüfen & abgeben",
  reviewGradeBtn: "Prüfen & Bewerten",
  livePreviewHeader: "Live-Diagramm-Vorschau",
  compiledAlert: "Kompiliert",
  errorAlert: "Fehler",
  awaitingInput: "Warte auf gültige Mermaid-Syntax-Eingaben...",
  sandboxTitle: "Sandkasten-Dojo-Spielplatz",
  sandboxSub: "Entwerfe, verfeinere und kompiliere Diagramme nach Belieben. Ideal für alltägliche Büroaufgaben.",
  loadTemplate: "Vorlage laden:",
  clearSandboxBtn: "Sandkasten leeren",
  copyMarkdownBtn: "Code-Markdown kopieren",
  copySvgBtn: "Diagramm-SVG kopieren",
  refTitle: "Die heiligen Spickzettel-Schriftrollen",
  refSub: "Schnelle Offline-Spickzettel, die die Standard-Syntax für die 4.000 Mitarbeiter zusammenfassen.",
  refSection1: "Flowchart-Formen, Richtungen & Subgraphs",
  refSection2: "Sequenz-Handshakes & Botschaftslinien",
  refSection3: "Git-Branching-Verläufe & Merges",
  senseiGreeting: "Willkommen, Lehrling! Um den nächsten Gürtel freizuschalten, schließe die aktuelle Herausforderung ab.",
  senseiTipSuccess: "Sensei sagt: Deine Syntax ist makellos! Klicke auf 'Prüfen', um deine logische Architektur zu testen.",
  senseiAlreadyMastered: "Sensei sagt: Du hast diese Schriftrolle bereits gemeistert, aber verfeinere sie gerne weiter!",
  senseiSpeechError: "Sensei sagt: Die Schriftrolle hat grammatikalische Fehler. Überprüfe Rechtschreibung, Pfeile (-->) oder Klammern.",
  senseiHumming: "*Brummt nachdenklich* Es sieht so aus, als ob dein Compiler blockiert ist. Überprüfe, ob alle Knoten-IDs übereinstimmen und die Pfeilsyntax korrekt ist!",
  modalTitle: "Shuriken errungen!",
  modalDesc: "Der Sensei steht voller Ehrfurcht da! Du hast die aktuelle Herausforderung erfolgreich gemeistert und die Büroprotokolle gerettet!",
  modalBadgeUnlocked: "Freigeschalteter Shuriken:",
  modalAdvanceBtn: "Zur nächsten Schriftrolle",
  modalClaimFinalBtn: "Ultimativen schwarzen Gürtel beanspruchen",
  toastReset: "Starter-Code der Herausforderung wiederhergestellt!",
  toastClear: "Sandkasten-Editor geleert!",
  toastCodeCopied: "Mermaid-Code in die Zwischenablage kopiert!",
  toastSvgCopied: "Diagramm-SVG-XML in die Zwischenablage kopiert!",
  toastTemplateLoaded: "Vorlage geladen!",
  syntaxAlertTitle: "Compiler-Syntax-Warnung",

  // Lokalisierte Lehrplandaten
  challenges: {
    level1: {
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
    level2: {
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
    level3: {
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
    level4: {
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
    level5: {
      name: "Schwarzer Gürtel",
      badgeName: "Der ultimative Git-Shogun",
      story: "Katastrophe! Ein Bug auf der Produktionsumgebung sorgt dafür, dass die Kaffeemaschine freitags entkoffeinierten Kaffee kocht. Die Belegschaft schläft ein! Zeichne die Git-Branching-Strategie für einen Hotfix auf Produktion auf, um das Koffein zu retten!",
      mission: "Erstelle einen Git-Verlauf (`gitGraph`), der die Hotfix-Verzweigung darstellt. Starte auf 'main', erstelle einen Commit, zweige einen 'hotfix'-Branch ab, committe den Fix und merge ihn zurück in 'main'.",
      checklist: [
        "Beginnt mit gitGraph",
        "Erstellt einen initialen Commit auf dem main-Branch",
        "Erstellt den hotfix-Branch: branch hotfix",
        "Checkt den hotfix-Branch aus: checkout hotfix",
        "Commitet den Koffein-Fix auf dem hotfix-Branch",
        "Checkt den main-Branch wieder aus: checkout main",
        "Mergt den hotfix-Branch zurück in main: merge hotfix"
      ],
      spickzettel: [
        { syntax: "gitGraph", desc: "Startet einen Git-Verlaufsgraphen" },
        { syntax: "commit id: \"Label\"", desc: "Platziert einen Commit mit einer Beschreibung/ID" },
        { syntax: "branch hotfix", desc: "Erstellt einen neuen Branch namens 'hotfix'" },
        { syntax: "checkout hotfix", desc: "Wechselt den aktiven Fokus auf den Branch 'hotfix'" },
        { syntax: "merge hotfix", desc: "Mergt den 'hotfix'-Branch zurück in den aktuellen Branch" }
      ],
      hint: {
        decl: "Sensei sagt: Um die Versionsgeschichte zu beherrschen, deklariere ganz oben ein 'gitGraph'!",
        branch: "Sensei sagt: Führe Operationen nicht direkt auf main aus! Zweige ab mittels: 'branch hotfix'.",
        checkout: "Sensei sagt: Du hast den Branch erstellt, stehst aber immer noch auf main! Verwende: 'checkout hotfix'.",
        empty: "Sensei sagt: Der hotfix-Branch ist leer! Füge einen Commit hinzu, während du auf hotfix stehst (z. B. 'commit id: \"Fix Caffeine Ratio\"').",
        returnMain: "Sensei sagt: Der Fix ist bereit, aber du musst in die primäre Zeitleiste zurückkehren. Nutze: 'checkout main'.",
        merge: "Sensei sagt: Die Wiedervereinigung fehlt! Merg den Fix zurück in main mittels: 'merge hotfix'."
      }
    }
  }
};
