import { describe, it, expect } from 'vitest';
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
  it('should validate contains_any keyword checks', () => {
    const rule = { type: 'contains_any' as const, keywords: ['apple', 'banana'], hintKey: 'fruit_missing' };
    expect(runDeclarativeValidation('This is a banana.', [rule]).success).toBe(true);
    expect(runDeclarativeValidation('This is a pear.', [rule]).success).toBe(false);
  });

  it('should validate contains_all keyword checks', () => {
    const rule = { type: 'contains_all' as const, keywords: ['apple', 'banana'], hintKey: 'fruits_missing' };
    expect(runDeclarativeValidation('I like apples and bananas.', [rule]).success).toBe(true);
    expect(runDeclarativeValidation('I only have an apple.', [rule]).success).toBe(false);
  });

  it('should validate not_contains keyword checks', () => {
    const rule = { type: 'not_contains' as const, keyword: 'secret', hintKey: 'security_leak' };
    expect(runDeclarativeValidation('Clean code snippet.', [rule]).success).toBe(true);
    expect(runDeclarativeValidation('Leak of secret password.', [rule]).success).toBe(false);
  });

  it('should validate node_defined shape declarations and labels', () => {
    const rule = { type: 'node_defined' as const, nodeId: 'db', nodeLabel: 'Operations database', hintKey: 'db_missing' };
    expect(runDeclarativeValidation('db[(Operations Database)]', [rule]).success).toBe(true);
    expect(runDeclarativeValidation('db[(Cache Database)]', [rule]).success).toBe(false);
    expect(runDeclarativeValidation('server[Operations Database]', [rule]).success).toBe(false);
  });

  it('should validate connection rules', () => {
    const rule = { type: 'connection' as const, from: 'Client', to: 'Server', hintKey: 'disconnected' };
    expect(runDeclarativeValidation('Client --> Server', [rule]).success).toBe(true);
    expect(runDeclarativeValidation('Client --> Gateway --> Server', [rule]).success).toBe(false);
  });

  it('should validate labeled connection rules', () => {
    const rule = { type: 'connection_labeled' as const, from: 'Auth', to: 'DB', label: 'SQL', hintKey: 'no_sql' };
    expect(runDeclarativeValidation('Auth -->|SQL| DB', [rule]).success).toBe(true);
    expect(runDeclarativeValidation('Auth --> DB', [rule]).success).toBe(false);
  });

  it('should validate custom regex assertions', () => {
    const rule = { type: 'regex' as const, pattern: '^graph\\s+TD', flags: 'i', hintKey: 'not_top_down' };
    expect(runDeclarativeValidation('graph TD\n  A --> B', [rule]).success).toBe(true);
    expect(runDeclarativeValidation('graph LR\n  A --> B', [rule]).success).toBe(false);
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
});
