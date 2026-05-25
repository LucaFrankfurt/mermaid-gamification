export interface ValidationResult {
  success: boolean;
  hintKey?: string;
}

export interface ValidationRule {
  type: 'contains_any' | 'contains_all' | 'not_contains' | 'node_defined' | 'connection' | 'connection_labeled' | 'regex' | 'git_branch' | 'git_checkout' | 'git_merge';
  hintKey: string;
  keywords?: string[];
  keyword?: string;
  nodeId?: string;
  nodeLabel?: string;
  from?: string;
  to?: string;
  label?: string;
  pattern?: string;
  flags?: string;
  branch?: string;
  keywordsStr?: string;
  enHint?: string;
  deHint?: string;
}

export interface Challenge {
  level: number;
  beltEmoji: string;
  badgeEmoji: string;
  xpReward: number;
  starterCode: string;
  solution?: string;
  validate?: (code: string) => ValidationResult;
  getChecklistStatus?: (code: string) => boolean[];
  rules?: ValidationRule[];
  isCustom?: boolean;
  en?: {
    name: string;
    badgeName: string;
    story: string;
    mission: string;
    checklist?: string[];
    spickzettel?: Array<{ syntax: string; desc: string }>;
    hint?: Record<string, string>;
    tips?: Record<string, string>;
  };
  de?: {
    name: string;
    badgeName: string;
    story: string;
    mission: string;
    checklist?: string[];
    spickzettel?: Array<{ syntax: string; desc: string }>;
    hint?: Record<string, string>;
    tips?: Record<string, string>;
  };
}

// Helper to check connections while ignoring node label brackets and custom inline shapes
export const hasConnection = (clean: string, from: string, to: string): boolean => {
  const regexStr = from + "(?:\\[[^\\]]*\\]|\\([^)]*\\)|{[^}]*})?--+>(?:\\|[^|]*\\|)?(?:\\[[^\\]]*\\]|\\([^)]*\\)|{[^}]*})?" + to;
  const regex = new RegExp(regexStr, 'i');
  return regex.test(clean);
};

// Helper to check labeled connections supporting arrow labels like -->|label| and --label-->
export const hasConnectionWithLabel = (clean: string, from: string, to: string, label: string): boolean => {
  const regexStr = from + "(?:\\[[^\\]]*\\]|\\([^)]*\\)|{[^}]*})?(?:--+>\\|?" + label + "\\|?|--+" + label + "--+>)(?:\\[[^\\]]*\\]|\\([^)]*\\)|{[^}]*})?" + to;
  const regex = new RegExp(regexStr, 'i');
  return regex.test(clean);
};

// Declarative Validation Engine for Custom/Standard Challenges
export const runDeclarativeValidation = (code: string, rules?: ValidationRule[]): ValidationResult => {
  if (!rules || !Array.isArray(rules)) return { success: true };
  
  const clean = code.trim().replace(/\s+/g, '');
  const lower = code.toLowerCase();
  
  for (const rule of rules) {
    if (rule.type === 'contains_any') {
      if (!rule.keywords) continue;
      const match = rule.keywords.some(kw => lower.includes(kw.toLowerCase().trim()));
      if (!match) return { success: false, hintKey: rule.hintKey };
    }
    
    else if (rule.type === 'contains_all') {
      if (!rule.keywords) continue;
      for (const kw of rule.keywords) {
        if (!lower.includes(kw.toLowerCase().trim())) {
          return { success: false, hintKey: rule.hintKey };
        }
      }
    }
    
    else if (rule.type === 'not_contains') {
      if (rule.keyword && lower.includes(rule.keyword.toLowerCase().trim())) {
        return { success: false, hintKey: rule.hintKey };
      }
    }
    
    else if (rule.type === 'node_defined') {
      const id = rule.nodeId ? rule.nodeId.trim() : '';
      const text = rule.nodeLabel ? rule.nodeLabel.toLowerCase().trim() : '';
      
      // Node ID must exist
      if (!code.includes(id)) {
        return { success: false, hintKey: rule.hintKey };
      }
      
      // Node text label must be matched inside brackets/parens/etc if supplied
      if (text && !lower.includes(text)) {
        return { success: false, hintKey: rule.hintKey };
      }
    }
    
    else if (rule.type === 'connection') {
      if (!rule.from || !rule.to) continue;
      const hasLink = hasConnection(clean, rule.from.trim(), rule.to.trim());
      if (!hasLink) return { success: false, hintKey: rule.hintKey };
    }
    
    else if (rule.type === 'connection_labeled') {
      if (!rule.from || !rule.to || !rule.label) continue;
      const hasLink = hasConnectionWithLabel(clean, rule.from.trim(), rule.to.trim(), rule.label.trim());
      if (!hasLink) return { success: false, hintKey: rule.hintKey };
    }
    
    else if (rule.type === 'regex') {
      if (!rule.pattern) continue;
      try {
        const rx = new RegExp(rule.pattern, rule.flags || 'i');
        if (!rx.test(code)) {
          return { success: false, hintKey: rule.hintKey };
        }
      } catch (e) {
        console.error("Invalid regex in validation rule", e);
        return { success: false, hintKey: rule.hintKey };
      }
    }
    
    else if (rule.type === 'git_branch') {
      if (!rule.branch) continue;
      const br = rule.branch.replace(/\s+/g, '');
      if (!clean.includes(`branch${br}`) && !clean.includes(`branch"${br}"`)) {
        return { success: false, hintKey: rule.hintKey };
      }
    }
    
    else if (rule.type === 'git_checkout') {
      if (!rule.branch) continue;
      const br = rule.branch.replace(/\s+/g, '');
      if (!clean.includes(`checkout${br}`) && !clean.includes(`checkout"${br}"`)) {
        return { success: false, hintKey: rule.hintKey };
      }
    }
    
    else if (rule.type === 'git_merge') {
      if (!rule.branch) continue;
      const br = rule.branch.replace(/\s+/g, '');
      if (!clean.includes(`merge${br}`) && !clean.includes(`merge"${br}"`)) {
        return { success: false, hintKey: rule.hintKey };
      }
    }
  }
  
  return { success: true };
};

// Helper to strip comments starting with '%%' from Mermaid code
export const stripComments = (code: string): string => {
  return code.split('\n')
    .map(line => {
      const idx = line.indexOf('%%');
      return idx !== -1 ? line.substring(0, idx) : line;
    })
    .join('\n');
};

// Unified validation handler routing
export const validateChallenge = (challenge: Challenge, code: string): ValidationResult => {
  const cleanCode = stripComments(code);
  if (challenge.validate) {
    return challenge.validate(cleanCode);
  }
  if (challenge.rules) {
    return runDeclarativeValidation(cleanCode, challenge.rules);
  }
  return { success: true };
};

// Returns an array of booleans mapping 1-to-1 to a challenge's checklist items
export const getChallengeChecklistStatus = (challenge: Challenge, code: string): boolean[] => {
  const cleanCode = stripComments(code);
  if (challenge.getChecklistStatus) {
    try {
      return challenge.getChecklistStatus(cleanCode);
    } catch (e) {
      console.error("Error running challenge checklist validation:", e);
      return [];
    }
  }
  if (challenge.rules) {
    return challenge.rules.map(rule => runDeclarativeValidation(cleanCode, [rule]).success);
  }
  return [];
};

