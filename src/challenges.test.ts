import { describe, it, expect, vi } from 'vitest';
import { 
  hasConnection, 
  hasConnectionWithLabel, 
  runDeclarativeValidation, 
  validateChallenge, 
  CHALLENGES 
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
