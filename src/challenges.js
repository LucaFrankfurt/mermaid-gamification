// Mermaid Ninja Sensei Challenge Curriculum - Zero Hardcoded User-Facing Values
// Houses only configuration parameters, starter codes, and automated code checkers.
// All visible string descriptions, checklists, and error hints are resolved modularly from i18n files.

// Helper to check connections while ignoring node label brackets and custom inline shapes
const hasConnection = (clean, from, to) => {
  const regexStr = from + "(?:\\[[^\\]]*\\]|\\([^)]*\\)|{[^}]*})?--+>(?:\\|[^|]*\\|)?(?:\\[[^\\]]*\\]|\\([^)]*\\)|{[^}]*})?" + to;
  const regex = new RegExp(regexStr, 'i');
  return regex.test(clean);
};

// Helper to check labeled connections supporting arrow labels like -->|label| and --label-->
const hasConnectionWithLabel = (clean, from, to, label) => {
  const regexStr = from + "(?:\\[[^\\]]*\\]|\\([^)]*\\)|{[^}]*})?(?:--+>\\|?" + label + "\\|?|--+" + label + "--+>)(?:\\[[^\\]]*\\]|\\([^)]*\\)|{[^}]*})?" + to;
  const regex = new RegExp(regexStr, 'i');
  return regex.test(clean);
};

export const CHALLENGES = [
  {
    level: 1,
    beltEmoji: "⬜",
    badgeEmoji: "☕",
    xpReward: 100,
    starterCode: `graph TD
    Start[Thirsty Employee Arrives] --> PressButton[Press Coffee Button]
    %% Sensei Hint: Complete the chain below!
    %% Make PressButton point to FillCup, and FillCup point to Enjoy.
`,
    validate: (code) => {
      const clean = code.trim().replace(/\s+/g, '');
      const lower = code.toLowerCase();
      
      if (!lower.includes("graph td") && !lower.includes("flowchart td") && !lower.includes("graph lr") && !lower.includes("flowchart lr")) {
        return { success: false, hintKey: "decl" };
      }

      // Check node definitions and labels
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

      // Check connections using robust connection helpers
      const hasLink1 = hasConnection(clean, 'Start', 'PressButton');
      const hasLink2 = hasConnection(clean, 'PressButton', 'FillCup');
      const hasLink3 = hasConnection(clean, 'FillCup', 'Enjoy');

      if (!hasLink1) return { success: false, hintKey: "link1" };
      if (!hasLink2) return { success: false, hintKey: "link2" };
      if (!hasLink3) return { success: false, hintKey: "link3" };

      return { success: true };
    }
  },
  {
    level: 2,
    beltEmoji: "🟨",
    badgeEmoji: "🔍",
    xpReward: 100,
    starterCode: `graph TD
    Start[Lost Post-it] --> IsItOnFloor{Is it on the floor?}
    %% Sensei Hint: Define the YES and NO branching paths below!
    %% Example: IsItOnFloor -->|Yes| UnderDesk[Look under the desk]
    %% Remember to connect both UnderDesk and CheckBin back to Found[Secret Password Recovered]!
`,
    validate: (code) => {
      const clean = code.trim().replace(/\s+/g, '');
      const lower = code.toLowerCase();

      if (!lower.includes("graph td") && !lower.includes("flowchart td") && !lower.includes("graph lr") && !lower.includes("flowchart lr")) {
        return { success: false, hintKey: "decl" };
      }

      if (!code.includes("IsItOnFloor{") || !code.includes("}")) {
        return { success: false, hintKey: "decision" };
      }

      // Check labeled branches robustly
      const hasYesBranch = hasConnectionWithLabel(clean, 'IsItOnFloor', 'UnderDesk', 'Yes');
      const hasNoBranch = hasConnectionWithLabel(clean, 'IsItOnFloor', 'CheckBin', 'No');

      if (!hasYesBranch) return { success: false, hintKey: "yesPath" };
      if (!hasNoBranch) return { success: false, hintKey: "noPath" };

      // Validate standard flow closure
      const underDeskToFound = hasConnection(clean, 'UnderDesk', 'Found');
      const checkBinToFound = hasConnection(clean, 'CheckBin', 'Found');

      if (!underDeskToFound) return { success: false, hintKey: "underLink" };
      if (!checkBinToFound) return { success: false, hintKey: "binLink" };

      if (!lower.includes("secret password recovered")) {
        return { success: false, hintKey: "foundNode" };
      }

      return { success: true };
    }
  },
  {
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
    validate: (code) => {
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

      // Check cross-boundary link robustly
      const hasCrossLink = hasConnection(clean, 'AppServer', 'db');
      if (!hasCrossLink) {
        return { success: false, hintKey: "link" };
      }

      return { success: true };
    }
  },
  {
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
    validate: (code) => {
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

      const hasStep3 = /Espresso_API--+>HR_Gateway:.*?double.*?shot/i.test(clean);
      if (!hasStep3) return { success: false, hintKey: "step3" };

      const hasStep4 = /HR_Gateway--+>Employee:.*?Access.*?Granted/i.test(clean) || /HR_Gateway->+>Employee:.*?Access.*?Granted/i.test(clean);
      if (!hasStep4) return { success: false, hintKey: "step4" };

      return { success: true };
    }
  },
  {
    level: 5,
    beltEmoji: "⬛",
    badgeEmoji: "👑",
    xpReward: 100,
    starterCode: `gitGraph
    commit id: "Initial Release"
    %% Sensei Hint: Create your hotfix strategy!
    %% 1. Branch 'hotfix'
    %% 2. Checkout 'hotfix'
    %% 3. Commit your fix (e.g. commit id: "Fix Caffeine Ratio")
    %% 4. Checkout 'main'
    %% 5. Merge 'hotfix' back into 'main'
`,
    validate: (code) => {
      const clean = code.trim().replace(/\s+/g, '');
      const lower = code.toLowerCase();

      if (!lower.includes("gitgraph")) {
        return { success: false, hintKey: "decl" };
      }

      if (!clean.includes("branchhotfix") && !clean.includes("branch\"hotfix\"")) {
        return { success: false, hintKey: "branch" };
      }

      if (!clean.includes("checkouthotfix") && !clean.includes("checkout\"hotfix\"")) {
        return { success: false, hintKey: "checkout" };
      }

      const parts = clean.split(/checkout/gi);
      const afterCheckoutHotfix = parts.find(p => p.startsWith("hotfix") || p.startsWith("\"hotfix\""));
      if (!afterCheckoutHotfix || !afterCheckoutHotfix.includes("commit")) {
        return { success: false, hintKey: "empty" };
      }

      if (!clean.includes("checkoutmain") && !clean.includes("checkout\"main\"")) {
        return { success: false, hintKey: "returnMain" };
      }

      if (!clean.includes("mergehotfix") && !clean.includes("merge\"hotfix\"")) {
        return { success: false, hintKey: "merge" };
      }

      return { success: true };
    }
  }
];
