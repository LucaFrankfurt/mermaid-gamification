import { describe, it, expect, vi } from 'vitest';
import { 
  hasConnection, 
  hasConnectionWithLabel, 
  runDeclarativeValidation, 
  validateChallenge, 
  CHALLENGES,
  getChallengeChecklistStatus,
  stripComments
} from './challenges';

describe('Mermaid Connection Parsers', () => {
  it('should match simple node connections while ignoring shapes and labels', () => {
    const code = 'Start[Thirsty Employee] --> PressButton(Press Button)'.replace(/\s+/g, '');
    expect(hasConnection(code, 'Start', 'PressButton')).toBe(true);
    expect(hasConnection(code, 'PressButton', 'Start')).toBe(false);
  });

  it('should match labeled connections supporting standard Arrow formats', () => {
    const code1 = 'IsItOnFloor -->|Yes| UnderDesk'.replace(/\s+/g, '');
    const code2 = 'IsItOnFloor -- Yes --> CheckBin'.replace(/\s+/g, '');
    
    expect(hasConnectionWithLabel(code1, 'IsItOnFloor', 'UnderDesk', 'Yes')).toBe(true);
    expect(hasConnectionWithLabel(code2, 'IsItOnFloor', 'CheckBin', 'Yes')).toBe(true);
    expect(hasConnectionWithLabel(code1, 'IsItOnFloor', 'CheckBin', 'Yes')).toBe(false);
  });
});

describe('Declarative Rules Validator Engine', () => {
  it('should return success when rules are absent or not an array', () => {
    // Covers the !rules guard branch (L297)
    expect(runDeclarativeValidation('any code').success).toBe(true);
    expect(runDeclarativeValidation('any code', undefined).success).toBe(true);
  });

  it('should validate contains_any keyword checks', () => {
    const rule = { type: 'contains_any' as const, keywords: ['apple', 'banana'], hintKey: 'fruit_missing' };
    expect(runDeclarativeValidation('This is a banana.', [rule]).success).toBe(true);
    expect(runDeclarativeValidation('This is a pear.', [rule]).success).toBe(false);
  });

  it('should skip contains_any rule when keywords property is missing', () => {
    // Covers the `if (!rule.keywords) continue` branch
    const rule = { type: 'contains_any' as const, hintKey: 'no_keywords' };
    expect(runDeclarativeValidation('anything', [rule]).success).toBe(true);
  });

  it('should validate contains_all keyword checks', () => {
    const rule = { type: 'contains_all' as const, keywords: ['apple', 'banana'], hintKey: 'fruits_missing' };
    expect(runDeclarativeValidation('I like apples and bananas.', [rule]).success).toBe(true);
    expect(runDeclarativeValidation('I only have an apple.', [rule]).success).toBe(false);
  });

  it('should skip contains_all rule when keywords property is missing', () => {
    // Covers the `if (!rule.keywords) continue` branch
    const rule = { type: 'contains_all' as const, hintKey: 'no_keywords' };
    expect(runDeclarativeValidation('anything', [rule]).success).toBe(true);
  });

  it('should validate not_contains keyword checks', () => {
    const rule = { type: 'not_contains' as const, keyword: 'secret', hintKey: 'security_leak' };
    expect(runDeclarativeValidation('Clean code snippet.', [rule]).success).toBe(true);
    expect(runDeclarativeValidation('Leak of secret password.', [rule]).success).toBe(false);
  });

  it('should skip not_contains rule when keyword property is missing', () => {
    // Covers the falsy `rule.keyword` branch
    const rule = { type: 'not_contains' as const, hintKey: 'no_keyword' };
    expect(runDeclarativeValidation('anything with secret info', [rule]).success).toBe(true);
  });

  it('should validate node_defined shape declarations and labels', () => {
    const rule = { type: 'node_defined' as const, nodeId: 'db', nodeLabel: 'Operations database', hintKey: 'db_missing' };
    expect(runDeclarativeValidation('db[(Operations Database)]', [rule]).success).toBe(true);
    expect(runDeclarativeValidation('db[(Cache Database)]', [rule]).success).toBe(false);
    expect(runDeclarativeValidation('server[Operations Database]', [rule]).success).toBe(false);
  });

  it('should pass node_defined when nodeLabel is absent (only nodeId checked)', () => {
    // Covers the `if (text && ...)` branch where text is empty
    const rule = { type: 'node_defined' as const, nodeId: 'db', hintKey: 'db_missing' };
    expect(runDeclarativeValidation('db[(Any Label)]', [rule]).success).toBe(true);
  });

  it('should validate connection rules', () => {
    const rule = { type: 'connection' as const, from: 'Client', to: 'Server', hintKey: 'disconnected' };
    expect(runDeclarativeValidation('Client --> Server', [rule]).success).toBe(true);
    expect(runDeclarativeValidation('Client --> Gateway --> Server', [rule]).success).toBe(false);
  });

  it('should skip connection rule when from or to is missing', () => {
    // Covers the `if (!rule.from || !rule.to) continue` branch
    const ruleNoFrom = { type: 'connection' as const, to: 'Server', hintKey: 'x' };
    const ruleNoTo = { type: 'connection' as const, from: 'Client', hintKey: 'x' };
    expect(runDeclarativeValidation('anything', [ruleNoFrom]).success).toBe(true);
    expect(runDeclarativeValidation('anything', [ruleNoTo]).success).toBe(true);
  });

  it('should validate labeled connection rules', () => {
    const rule = { type: 'connection_labeled' as const, from: 'Auth', to: 'DB', label: 'SQL', hintKey: 'no_sql' };
    expect(runDeclarativeValidation('Auth -->|SQL| DB', [rule]).success).toBe(true);
    expect(runDeclarativeValidation('Auth --> DB', [rule]).success).toBe(false);
  });

  it('should skip connection_labeled rule when from, to, or label is missing', () => {
    // Covers the `if (!rule.from || !rule.to || !rule.label) continue` branch
    const ruleNoLabel = { type: 'connection_labeled' as const, from: 'Auth', to: 'DB', hintKey: 'x' };
    expect(runDeclarativeValidation('Auth --> DB', [ruleNoLabel]).success).toBe(true);
  });

  it('should validate custom regex assertions', () => {
    const rule = { type: 'regex' as const, pattern: '^graph\\s+TD', flags: 'i', hintKey: 'not_top_down' };
    expect(runDeclarativeValidation('graph TD\n  A --> B', [rule]).success).toBe(true);
    expect(runDeclarativeValidation('graph LR\n  A --> B', [rule]).success).toBe(false);
  });

  it('should skip regex rule when pattern is missing', () => {
    // Covers the `if (!rule.pattern) continue` branch
    const rule = { type: 'regex' as const, hintKey: 'no_pattern' };
    expect(runDeclarativeValidation('anything', [rule]).success).toBe(true);
  });

  it('should handle an invalid regex pattern gracefully', () => {
    // Covers the catch(e) branch in the regex handler
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const rule = { type: 'regex' as const, pattern: '[invalid(regex', hintKey: 'bad_regex' };
    const result = runDeclarativeValidation('test code', [rule]);
    expect(result.success).toBe(false);
    expect(result.hintKey).toBe('bad_regex');
    consoleErrorSpy.mockRestore();
  });

  it('should validate gitGraph branch operations', () => {
    const ruleBranch = { type: 'git_branch' as const, branch: 'hotfix', hintKey: 'no_hotfix' };
    const ruleCheckout = { type: 'git_checkout' as const, branch: 'hotfix', hintKey: 'no_checkout' };
    const ruleMerge = { type: 'git_merge' as const, branch: 'hotfix', hintKey: 'no_merge' };
    
    const code = `gitGraph
      commit id: "Initial"
      branch hotfix
      checkout hotfix
      commit id: "Fix"
      checkout main
      merge hotfix
    `;
    
    expect(runDeclarativeValidation(code, [ruleBranch]).success).toBe(true);
    expect(runDeclarativeValidation(code, [ruleCheckout]).success).toBe(true);
    expect(runDeclarativeValidation(code, [ruleMerge]).success).toBe(true);
    expect(runDeclarativeValidation('gitGraph\ncommit', [ruleBranch]).success).toBe(false);
  });

  it('should match quoted branch names for git_branch, git_checkout, and git_merge', () => {
    // Covers the `clean.includes('branch"${br}"')` etc. alternate branches (L367, L375, L383)
    const codeQuoted = `gitGraph\nbranch"hotfix"\ncheckout"hotfix"\ncommitid:"Fix"\ncheckout"main"\nmerge"hotfix"`.replace(/\s+/g, '');
    
    const ruleBranch   = { type: 'git_branch'   as const, branch: 'hotfix', hintKey: 'no_hotfix' };
    const ruleCheckout = { type: 'git_checkout'  as const, branch: 'hotfix', hintKey: 'no_checkout' };
    const ruleMerge    = { type: 'git_merge'     as const, branch: 'hotfix', hintKey: 'no_merge' };
    
    expect(runDeclarativeValidation(codeQuoted, [ruleBranch]).success).toBe(true);
    expect(runDeclarativeValidation(codeQuoted, [ruleCheckout]).success).toBe(true);
    expect(runDeclarativeValidation(codeQuoted, [ruleMerge]).success).toBe(true);
  });

  it('should skip git_branch, git_checkout, git_merge rules when branch property is missing', () => {
    // Covers the `if (!rule.branch) continue` branches
    const ruleBranch   = { type: 'git_branch'   as const, hintKey: 'x' };
    const ruleCheckout = { type: 'git_checkout'  as const, hintKey: 'x' };
    const ruleMerge    = { type: 'git_merge'     as const, hintKey: 'x' };
    expect(runDeclarativeValidation('gitGraph', [ruleBranch]).success).toBe(true);
    expect(runDeclarativeValidation('gitGraph', [ruleCheckout]).success).toBe(true);
    expect(runDeclarativeValidation('gitGraph', [ruleMerge]).success).toBe(true);
  });
});

describe('validateChallenge routing', () => {
  it('should route to custom validate() function when present', () => {
    // Covers L394-396
    const challenge = CHALLENGES[0];
    expect(typeof challenge.validate).toBe('function');
    const result = validateChallenge(challenge, 'graph TD\nA --> B');
    expect(result.success).toBe(false); // missing nodes → fails
  });

  it('should route to runDeclarativeValidation when only rules are present', () => {
    // Covers L397-399
    const challenge = {
      level: 99,
      beltEmoji: '🟣',
      badgeEmoji: '🧪',
      xpReward: 0,
      starterCode: '',
      rules: [{ type: 'contains_any' as const, keywords: ['test'], hintKey: 'missing_test' }],
    };
    expect(validateChallenge(challenge, 'has a test keyword').success).toBe(true);
    expect(validateChallenge(challenge, 'nothing relevant').success).toBe(false);
  });

  it('should return success when challenge has neither validate nor rules', () => {
    // Covers L400 passthrough
    const challenge = {
      level: 99,
      beltEmoji: '🟣',
      badgeEmoji: '🧪',
      xpReward: 0,
      starterCode: '',
    };
    expect(validateChallenge(challenge, 'anything').success).toBe(true);
  });
});

describe('Curriculum Levels Logic Sanity (Levels 1 - 5)', () => {
  it('should pass Level 1 with standard coffee machine protocol solution', () => {
    const solution = `graph TD
      Start[Thirsty Employee Arrives] --> PressButton[Press Coffee Button]
      PressButton --> FillCup[Cup Fills with Espresso]
      FillCup --> Enjoy[Sip with Corporate Satisfaction]
    `;
    const challenge = CHALLENGES[0];
    const res = validateChallenge(challenge, solution);
    expect(res.success).toBe(true);
  });

  it('should fail Level 1 if nodes are missing or improperly connected', () => {
    const challenge = CHALLENGES[0];
    
    // Missing Start node
    expect(validateChallenge(challenge, 'graph TD\nPressButton --> FillCup').success).toBe(false);
    
    // Broken link
    const brokenLink = `graph TD
      Start[Thirsty Employee Arrives]
      PressButton[Press Coffee Button] --> FillCup[Cup Fills with Espresso] --> Enjoy[Sip with Corporate Satisfaction]
    `;
    expect(validateChallenge(challenge, brokenLink).success).toBe(false);
  });

  it('should fail Level 1 on each individual missing element', () => {
    const c = CHALLENGES[0];
    // Missing declaration
    expect(validateChallenge(c, 'Start[Thirsty Employee Arrives] --> PressButton').success).toBe(false);
    // Has decl + Start, missing PressButton label
    expect(validateChallenge(c, 'graph TD\nStart[Thirsty Employee Arrives] --> X').success).toBe(false);
    // Has decl + Start + PressButton, missing FillCup
    const noFill = 'graph TD\nStart[Thirsty Employee Arrives]\nPressButton[Press Coffee Button]\nStart --> PressButton';
    expect(validateChallenge(c, noFill).success).toBe(false);
    // Has decl + all nodes, missing Enjoy
    const noEnjoy = 'graph TD\nStart[Thirsty Employee Arrives]\nPressButton[Press Coffee Button]\nFillCup[Cup Fills with Espresso]\nStart --> PressButton\nPressButton --> FillCup';
    expect(validateChallenge(c, noEnjoy).success).toBe(false);
  });

  it('should pass Level 2 with standard branching decision path', () => {
    const solution = `graph TD
      Start[Lost Post-it] --> IsItOnFloor{Is it on the floor?}
      IsItOnFloor -->|Yes| UnderDesk[Look under the desk]
      IsItOnFloor -->|No| CheckBin[Check recycling bin]
      UnderDesk --> Found[Secret Password Recovered]
      CheckBin --> Found
    `;
    const challenge = CHALLENGES[1];
    expect(validateChallenge(challenge, solution).success).toBe(true);
  });

  it('should fail Level 2 on each individual missing element', () => {
    const c = CHALLENGES[1];
    // Missing declaration
    expect(validateChallenge(c, 'IsItOnFloor{Is it on the floor?}').success).toBe(false);
    // Missing decision node
    expect(validateChallenge(c, 'graph TD\nStart --> Something').success).toBe(false);
    // Missing Yes branch
    const noYes = 'graph TD\nIsItOnFloor{Is it on the floor?}\nIsItOnFloor -->|No| CheckBin[Check recycling bin]';
    expect(validateChallenge(c, noYes).success).toBe(false);
    // Missing No branch
    const noNo = 'graph TD\nIsItOnFloor{Is it on the floor?}\nIsItOnFloor -->|Yes| UnderDesk[Look under the desk]';
    expect(validateChallenge(c, noNo).success).toBe(false);
    // Missing underLink
    const noUnderLink = 'graph TD\nIsItOnFloor{Is it on the floor?}\nIsItOnFloor -->|Yes| UnderDesk[Look under the desk]\nIsItOnFloor -->|No| CheckBin[Check recycling bin]\nCheckBin --> Found[Secret Password Recovered]';
    expect(validateChallenge(c, noUnderLink).success).toBe(false);
    // Missing binLink
    const noBinLink = 'graph TD\nIsItOnFloor{Is it on the floor?}\nIsItOnFloor -->|Yes| UnderDesk[Look under the desk]\nIsItOnFloor -->|No| CheckBin[Check recycling bin]\nUnderDesk --> Found[Secret Password Recovered]';
    expect(validateChallenge(c, noBinLink).success).toBe(false);
    // Missing foundNode label
    const noFoundLabel = 'graph TD\nIsItOnFloor{Is it on the floor?}\nIsItOnFloor -->|Yes| UnderDesk[Look under the desk]\nIsItOnFloor -->|No| CheckBin[Check recycling bin]\nUnderDesk --> Found\nCheckBin --> Found';
    expect(validateChallenge(c, noFoundLabel).success).toBe(false);
  });

  it('should pass Level 3 with Operations subgraph operations and cross-boundary DB node', () => {
    const solution = `graph TD
      AppServer[Office App Server]
      subgraph "HQ Operations"
        db[("Coffee Log Database")]
      end
      AppServer --> db
    `;
    const challenge = CHALLENGES[2];
    expect(validateChallenge(challenge, solution).success).toBe(true);
  });

  it('should fail Level 3 on each individual missing element', () => {
    const c = CHALLENGES[2];
    // Missing subgraph/end
    expect(validateChallenge(c, 'graph TD\nAppServer --> db').success).toBe(false);
    // Missing HQ Operations name
    expect(validateChallenge(c, 'graph TD\nsubgraph "Other"\nend\nAppServer --> db').success).toBe(false);
    // Missing db shape
    expect(validateChallenge(c, 'graph TD\nsubgraph "HQ Operations"\ndb[Normal Box]\nend\nAppServer --> db').success).toBe(false);
    // Missing cross-boundary link
    expect(validateChallenge(c, 'graph TD\nsubgraph "HQ Operations"\ndb[("Coffee Log Database")]\nend').success).toBe(false);
  });

  it('should pass Level 4 with sequential network request handshakes', () => {
    const solution = `sequenceDiagram
      participant Employee
      participant HR_Gateway
      participant Espresso_API
      
      Employee->>HR_Gateway: Request Email Access
      HR_Gateway->>Espresso_API: Has employee had espresso?
      Espresso_API-->>HR_Gateway: Yes, double shot
      HR_Gateway-->>Employee: Access Granted
    `;
    const challenge = CHALLENGES[3];
    expect(validateChallenge(challenge, solution).success).toBe(true);
  });

  it('should fail Level 4 on each individual missing element', () => {
    const c = CHALLENGES[3];
    // Missing sequenceDiagram
    expect(validateChallenge(c, 'Employee->>HR_Gateway: Request Email Access').success).toBe(false);
    // Missing actors
    expect(validateChallenge(c, 'sequenceDiagram\nA->>B: Hello').success).toBe(false);
    // Missing step 1
    expect(validateChallenge(c, 'sequenceDiagram\nparticipant Employee\nparticipant HR_Gateway\nparticipant Espresso_API').success).toBe(false);
    // Missing step 2
    const noStep2 = 'sequenceDiagram\nparticipant Employee\nparticipant HR_Gateway\nparticipant Espresso_API\nEmployee->>HR_Gateway: Request Email Access';
    expect(validateChallenge(c, noStep2).success).toBe(false);
    // Missing step 3
    const noStep3 = noStep2 + '\nHR_Gateway->>Espresso_API: Has employee had espresso?';
    expect(validateChallenge(c, noStep3).success).toBe(false);
    // Missing step 4
    const noStep4 = noStep3 + '\nEspresso_API-->>HR_Gateway: Yes, double shot';
    expect(validateChallenge(c, noStep4).success).toBe(false);
  });

  it('should pass Level 5 with gitGraph branch checkout commit and merge operations', () => {
    const solution = `gitGraph
      commit id: "Initial Release"
      branch hotfix
      checkout hotfix
      commit id: "Fix Caffeine Ratio"
      checkout main
      merge hotfix
    `;
    const challenge = CHALLENGES[4];
    expect(validateChallenge(challenge, solution).success).toBe(true);
  });

  it('should fail Level 5 on each individual missing element', () => {
    const c = CHALLENGES[4];
    // Missing gitGraph
    expect(validateChallenge(c, 'commit id: "Initial"').success).toBe(false);
    // Missing branch hotfix
    expect(validateChallenge(c, 'gitGraph\ncommit id: "Initial"').success).toBe(false);
    // Missing checkout hotfix
    expect(validateChallenge(c, 'gitGraph\ncommit id: "Initial"\nbranch hotfix').success).toBe(false);
    // Missing commit on hotfix branch
    const noCommit = 'gitGraph\ncommit id: "Initial"\nbranch hotfix\ncheckout hotfix\ncheckout main';
    expect(validateChallenge(c, noCommit).success).toBe(false);
    // Missing checkout main
    const noCheckoutMain = 'gitGraph\ncommit id: "Initial"\nbranch hotfix\ncheckout hotfix\ncommit id: "Fix"';
    expect(validateChallenge(c, noCheckoutMain).success).toBe(false);
    // Missing merge hotfix
    const noMerge = 'gitGraph\ncommit id: "Initial"\nbranch hotfix\ncheckout hotfix\ncommit id: "Fix"\ncheckout main';
    expect(validateChallenge(c, noMerge).success).toBe(false);
  });
});

describe('Curriculum Levels Logic Sanity (Levels 6 - 10)', () => {
  it('should pass Level 6 with brewing state transitions', () => {
    const solution = `stateDiagram-v2
      [*] --> Off
      Off --> Idle : turn_on
      Idle --> Heating : press_brew
      Heating --> Dispensing : water_ready
      Dispensing --> Idle : cup_full
    `;
    const challenge = CHALLENGES[5];
    expect(validateChallenge(challenge, solution).success).toBe(true);
  });

  it('should fail Level 6 on missing or incorrect state transitions', () => {
    const challenge = CHALLENGES[5];
    // Missing cup_full transition back to Idle
    const broken = `stateDiagram-v2
      [*] --> Off
      Off --> Idle : turn_on
      Idle --> Heating : press_brew
      Heating --> Dispensing : water_ready
    `;
    expect(validateChallenge(challenge, broken).success).toBe(false);
  });

  it('should pass Level 7 with OOP ninja relationships', () => {
    const solution = `classDiagram
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
      Ninja --> Belt : wears
    `;
    const challenge = CHALLENGES[6];
    expect(validateChallenge(challenge, solution).success).toBe(true);
  });

  it('should fail Level 7 on missing inheritance or methods', () => {
    const challenge = CHALLENGES[6];
    // Missing inheritance Ninja <|-- Sensei
    const broken = `classDiagram
      class Ninja {
        +String name
      }
      class Sensei {
        +teachMastery()
        +gradeScroll()
      }
      Ninja --> Belt
    `;
    expect(validateChallenge(challenge, broken).success).toBe(false);
  });

  it('should pass Level 8 with morning empathy routine scores', () => {
    const solution = `journey
      title A Ninja Morning Routine
      section Wake Up
        Get out of bed: 3: Ninja
        Walk to Dojo: 4: Ninja
      section Caffeine Access
        Order Double Shot: 1: Ninja
        Drink Nectar of Gods: 5: Ninja, Sensei
    `;
    const challenge = CHALLENGES[7];
    expect(validateChallenge(challenge, solution).success).toBe(true);
  });

  it('should fail Level 8 on incorrect emotion levels or tasks', () => {
    const challenge = CHALLENGES[7];
    // Wrong emotional score for Walk to Dojo
    const broken = `journey
      title A Ninja Morning Routine
      section Wake Up
        Get out of bed: 3: Ninja
        Walk to Dojo: 1: Ninja
      section Caffeine Access
        Order Double Shot: 1: Ninja
        Drink Nectar of Gods: 5: Ninja, Sensei
    `;
    expect(validateChallenge(challenge, broken).success).toBe(false);
  });

  it('should pass Level 9 with standard coffee beans consumption', () => {
    const solution = `pie title Dojo Coffee Beans Consumption
      "Arabica" : 55
      "Robusta" : 35
      "Liberica" : 10
    `;
    const challenge = CHALLENGES[8];
    expect(validateChallenge(challenge, solution).success).toBe(true);
  });

  it('should fail Level 9 on unbalanced bean ratios', () => {
    const challenge = CHALLENGES[8];
    // Arabica is set to 40 instead of 55
    const broken = `pie title Dojo Coffee Beans Consumption
      "Arabica" : 40
      "Robusta" : 35
      "Liberica" : 10
    `;
    expect(validateChallenge(challenge, broken).success).toBe(false);
  });

  it('should pass Level 10 with ninja database schemas', () => {
    const solution = `erDiagram
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
      CHALLENGE ||--|| BELT : unlocks
    `;
    const challenge = CHALLENGES[9];
    expect(validateChallenge(challenge, solution).success).toBe(true);
  });

  it('should fail Level 10 on invalid attribute schema structure', () => {
    const challenge = CHALLENGES[9];
    // Missing xpReward attribute on CHALLENGE entity
    const broken = `erDiagram
      NINJA ||--o{ CHALLENGE : completes
      NINJA {
          string name
          int xp
      }
      CHALLENGE {
          int level
          string badgeEmoji
      }
      CHALLENGE ||--|| BELT : unlocks
    `;
    expect(validateChallenge(challenge, broken).success).toBe(false);
  });
});

describe('Dynamic Checklist Status Validation', () => {
  it('should return boolean array mapping 1-to-1 with checklist items on Level 1', () => {
    const challenge = CHALLENGES[0];
    const starterCheck = getChallengeChecklistStatus(challenge, challenge.starterCode);
    
    // Checklist for Level 1 has 8 items
    expect(starterCheck.length).toBe(8);
    // Starter code should satisfy some (like decl, nodes define) but not all connections
    expect(starterCheck[0]).toBe(true); // decl: graph TD
    expect(starterCheck[1]).toBe(true); // node Start
    expect(starterCheck[5]).toBe(true); // link 1
    expect(starterCheck[6]).toBe(false); // link 2 is missing in starter code
    expect(starterCheck[7]).toBe(false); // link 3 is missing in starter code

    // Full solution code should satisfy all 8 checklist items
    const solutionCheck = getChallengeChecklistStatus(challenge, challenge.solution || '');
    expect(solutionCheck).toEqual([true, true, true, true, true, true, true, true]);
  });

  it('should return boolean array mapping 1-to-1 with checklist items on Level 3', () => {
    const challenge = CHALLENGES[2];
    const starterCheck = getChallengeChecklistStatus(challenge, challenge.starterCode);
    expect(starterCheck.length).toBe(5);
    
    const solutionCheck = getChallengeChecklistStatus(challenge, challenge.solution || '');
    expect(solutionCheck).toEqual([true, true, true, true, true]);
  });

  it('should return boolean array mapping 1-to-1 with checklist items on custom levels using rules', () => {
    const mockCustomChallenge = {
      level: 11,
      beltEmoji: "🥋",
      badgeEmoji: "🥇",
      xpReward: 100,
      starterCode: "graph TD\n  A --> B",
      rules: [
        { type: 'contains_any' as const, keywords: ['graph td', 'flowchart td'], hintKey: 'decl', enHint: 'Decl' },
        { type: 'connection' as const, from: 'A', to: 'B', hintKey: 'connAB', enHint: 'Conn AB' },
        { type: 'connection' as const, from: 'B', to: 'C', hintKey: 'connBC', enHint: 'Conn BC' }
      ]
    };
    
    const partialCheck = getChallengeChecklistStatus(mockCustomChallenge, "graph TD\n  A --> B");
    expect(partialCheck).toEqual([true, true, false]);

    const fullCheck = getChallengeChecklistStatus(mockCustomChallenge, "graph TD\n  A --> B\n  B --> C");
    expect(fullCheck).toEqual([true, true, true]);
  });

  it('should ignore requirements in comments inside the editor', () => {
    const challenge = CHALLENGES[1]; // Level 2 Decision Flowchart
    
    // Raw code containing decision arrow in a comment
    const commentedCode = `graph TD
      Start[Lost Post-it] --> IsItOnFloor{Is it on the floor?}
      %% IsItOnFloor -->|Yes| UnderDesk[Look under the desk]
    `;
    
    const checklist = getChallengeChecklistStatus(challenge, commentedCode);
    
    // Checklist items:
    // 0: decl (true)
    // 1: decision node (true)
    // 2: Yes path (SHOULD BE FALSE because it is inside the comment!)
    expect(checklist[0]).toBe(true);
    expect(checklist[1]).toBe(true);
    expect(checklist[2]).toBe(false); 
  });
});

describe('Comment Stripping Utility', () => {
  it('should remove comments starting with %%', () => {
    const raw = "A --> B %% Some comment here\n%% full line comment\nC --> D";
    expect(stripComments(raw).trim()).toBe("A --> B \n\nC --> D");
  });
});


