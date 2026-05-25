import { Challenge, ValidationResult } from './types';

export const level5: Challenge = {
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
  solution: `gitGraph
    commit id: "Initial Release"
    branch hotfix
    checkout hotfix
    commit id: "Fix Caffeine Ratio"
    checkout main
    merge hotfix`,
  en: {
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
  },
  de: {
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
      { syntax: "commit id: \"Label\"", desc: "Setzt einen Commit mit einer Beschreibung/ID" },
      { syntax: "branch hotfix", desc: "Erstellt einen neuen Branch namens 'hotfix'" },
      { syntax: "checkout hotfix", desc: "Wechselt den aktiven Fokus auf den 'hotfix'-Branch" },
      { syntax: "merge hotfix", desc: "Mergt den hotfix-Branch zurück in den aktuellen Branch" }
    ],
    hint: {
      decl: "Sensei sagt: To master the version history, you must declare a 'gitGraph' at the top!",
      branch: "Sensei sagt: Do not perform surgical repairs directly on main! Branch off using: 'branch hotfix'.",
      checkout: "Sensei sagt: You created the branch but you are still standing on main. Run: 'checkout hotfix'.",
      empty: "Sensei sagt: The hotfix branch is empty! Add a commit while checked out to hotfix (e.g., 'commit id: \"Fix Caffeine Ratio\"').",
      returnMain: "Sensei sagt: The fix is done, but you must return to the primary timeline. Run: 'checkout main'.",
      merge: "Sensei sagt: The grand reunion is missing! Merge the fix back into main using: 'merge hotfix'."
    }
  },
  validate: (code: string): ValidationResult => {
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
  },
  getChecklistStatus: (code: string): boolean[] => {
    const clean = code.trim().replace(/\s+/g, '');
    const lower = code.toLowerCase();
    
    const idxCommit = clean.indexOf("commit");
    const idxBranch = clean.includes("branchhotfix") ? clean.indexOf("branchhotfix") : clean.includes('branch"hotfix"') ? clean.indexOf('branch"hotfix"') : -1;
    const hasInitialCommit = idxCommit !== -1 && (idxBranch === -1 || idxCommit < idxBranch);

    const parts = clean.split(/checkout/gi);
    const afterCheckoutHotfix = parts.find(p => p.startsWith("hotfix") || p.startsWith("\"hotfix\""));
    const hasHotfixCommit = !!afterCheckoutHotfix && afterCheckoutHotfix.includes("commit");

    return [
      lower.includes("gitgraph"),
      hasInitialCommit,
      clean.includes("branchhotfix") || clean.includes('branch"hotfix"'),
      clean.includes("checkouthotfix") || clean.includes('checkout"hotfix"'),
      hasHotfixCommit,
      clean.includes("checkoutmain") || clean.includes('checkout"main"'),
      clean.includes("mergehotfix") || clean.includes('merge"hotfix"')
    ];
  }
};
