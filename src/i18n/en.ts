// English translation dictionary for Mermaid Ninja Dojo
export default {
  // Static UI copies
  dojoTitle: "Mermaid Ninja Dojo",
  dojoSub: "Master text-to-diagramming in our sandboxed, zero-mouse temple.",
  beltLabel: "Belt Status",
  totalXp: "Total XP",
  unlockedBadges: "Unlocked Badges",
  journeyTab: "Ninja Journey",
  sandboxTab: "Free Sandbox Mode",
  referenceTab: "Dojo Reference Scroll",
  curriculumHeader: "Curriculum Progress",
  missionHeader: "Your Mission:",
  gradeReqs: "Grade Requirements:",
  scrollCheatSheet: "Scroll Cheat Sheet:",
  syntaxHeader: "Syntax",
  resultHeader: "Result",
  editorHeader: "Code Editor Workspace",
  resetBtn: "Reset Starter",
  copyCodeBtn: "Copy Code",
  gradeSubmitBtn: "Grade Code & Submit",
  reviewGradeBtn: "Review & Grade",
  livePreviewHeader: "Live Flowchart Preview",
  compiledAlert: "Compiled",
  errorAlert: "Error",
  awaitingInput: "Awaiting valid Mermaid syntax inputs...",
  sandboxTitle: "Sandbox Dojo Playground",
  sandboxSub: "Construct, refine, and compile diagrams freely. Ideal for routine corporate assignments.",
  loadTemplate: "Load Template:",
  clearSandboxBtn: "Clear Sandbox",
  copyMarkdownBtn: "Copy Code Markdown",
  copySvgBtn: "Copy Diagram SVG",
  refTitle: "The Sacred Cheatsheet Scrolls",
  refSub: "Quick, offline cheatsheets summarizing standard syntax for the 4,000 office staff.",
  refSection1: "Flowchart Shapes, Directions & Subgraphs",
  refSection2: "Sequence Handshakes & Message Lifelines",
  refSection3: "Git Branching Graphs & Merges",
  senseiGreeting: "Welcome, apprentice! To unlock the next Belt, complete the current challenge.",
  senseiTipSuccess: "Sensei says: Your syntax is flawless! Click 'Grade Code' to test your architectural logic.",
  senseiAlreadyMastered: "Sensei says: You have already mastered this scroll, but feel free to perfect its style!",
  senseiSpeechError: "Sensei says: The scroll has broken grammar. Double-check your spelling, arrows (-->), or brackets.",
  senseiHumming: "*Humming thoughtfully* It looks like your compiler has choked. Double check that all node identifiers match and you are using appropriate arrow syntax!",
  modalTitle: "Shuriken Claimed!",
  modalDesc: "Sensei stands in awe! You have successfully mastered the current challenge scroll, restoring stability to the office protocols!",
  modalBadgeUnlocked: "Unlocked Badge:",
  modalAdvanceBtn: "Advance to Next Scroll",
  modalClaimFinalBtn: "Claim Final Black Belt",
  toastReset: "Challenge starter code restored!",
  toastClear: "Sandbox editor cleared!",
  toastCodeCopied: "Mermaid code copied to clipboard!",
  toastSvgCopied: "Diagram SVG XML copied to clipboard!",
  toastTemplateLoaded: "Loaded template!",
  syntaxAlertTitle: "Compiler Syntax Alert",
  lineWrap: "Line Wrap",

  // Localized curriculum challenges data
  challenges: {
    level1: {
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
    level2: {
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
    level3: {
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
    level4: {
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
    level5: {
      name: "Black Belt",
      badgeName: "The Ultimate Git Shogun",
      story: "Disaster has struck! A production bug was discovered where the office coffee machine started brewing decaf on Friday afternoons. The entire staff is sluggish. As the Ultimate Architect, you must map out the Git branching strategy to implement a hotfix directly on production and restore high-octane caffeine flows!",
      mission: "Create a Git Graph (`gitGraph`) demonstrating the branching hotfix strategy. Start on main, make a commit, branch a hotfix, commit the fix, and merge it back into main.",
      checklist: [
        "Starts with gitGraph",
        "Creates an initial commit on main branch",
        "Creates the hotfix branch using: branch hotfix",
        "Checkouts hotfix branch using: checkout hotfix",
        "Commits the caffeine restoration fix on the hotfix branch",
        "Checkouts main branch using: checkout main",
        "Merges hotfix branch back to main using: merge hotfix"
      ],
      spickzettel: [
        { syntax: "gitGraph", desc: "Start a Git Graph layout block" },
        { syntax: "commit id: \"Label\"", desc: "Place a commit with a descriptive tag/ID" },
        { syntax: "branch hotfix", desc: "Create a new branch named 'hotfix'" },
        { syntax: "checkout hotfix", desc: "Switch active focus to the 'hotfix' branch" },
        { syntax: "merge hotfix", desc: "Merge the hotfix branch back into current branch" }
      ],
      hint: {
        decl: "Sensei says: To master the version history, you must declare a 'gitGraph' at the top!",
        branch: "Sensei says: Do not perform surgical repairs directly on main! Branch off using: 'branch hotfix'.",
        checkout: "Sensei says: You created the branch but you are still standing on main. Run: 'checkout hotfix'.",
        empty: "Sensei says: The hotfix branch is empty! Add a commit while checked out to hotfix (e.g., 'commit id: \"Fix Caffeine Ratio\"').",
        returnMain: "Sensei says: The fix is done, but you must return to the primary timeline. Run: 'checkout main'.",
        merge: "Sensei says: The grand reunion is missing! Merge the fix back into main using: 'merge hotfix'."
      }
    }
  }
};
