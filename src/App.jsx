import { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { CHALLENGES } from './challenges.js';
import { TRANSLATIONS } from './i18n.js';
import { playSuccess, playFailure, playLevelUp, playClick } from './soundEffects.js';

// Premium lucide-react icons for UI styling
import {
  Play,
  CheckCircle,
  Copy,
  RotateCcw,
  HelpCircle,
  Trophy,
  Code,
  Sparkles,
  Lock,
  Unlock,
  BookOpen,
  ArrowRight,
  Flame,
  ChevronDown,
  Info,
  Sun,
  Moon
} from 'lucide-react';

// Initialize Mermaid with clean light-theme styles that match our warm cream vibe
mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis'
  },
  themeVariables: {
    primaryColor: '#ffffff',
    primaryBorderColor: '#201515',
    primaryTextColor: '#201515',
    lineColor: '#ff4f00',
    transitionDuration: '0.3s',
    actorBkg: '#ffffff',
    actorBorder: '#201515',
    actorTextColor: '#201515',
    signalColor: '#ff4f00',
    signalTextColor: '#201515',
    labelBoxBkgColor: '#fffefb',
    labelBoxBorderColor: '#e6e0d5',
    labelTextColor: '#201515'
  }
});

/**
 * Highly optimized, offline-safe Mermaid.js real-time syntax highlighter function
 * Escapes HTML tags and wraps keywords, arrows, labels, strings and comments in styled tokens.
 */
const highlightMermaid = (code) => {
  if (!code) return '';
  
  // Escape HTML to prevent injection and layout breakdown
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // 1. Comments Token preservation (%% ...)
  const comments = [];
  escaped = escaped.replace(/(%%.*)/g, (match) => {
    comments.push(match);
    return `__COMMENT_${comments.length - 1}__`;
  });

  // 2. Strings Token preservation ("...")
  const strings = [];
  escaped = escaped.replace(/("[^"]*")/g, (match) => {
    strings.push(match);
    return `__STRING_${index = strings.length - 1}__`;
  });

  // 3. Keywords
  const keywords = [
    'graph', 'flowchart', 'sequenceDiagram', 'gitGraph', 'stateDiagram-v2', 'stateDiagram',
    'subgraph', 'end', 'participant', 'actor', 'activate', 'deactivate', 'commit', 'branch',
    'checkout', 'merge', 'rect', 'note', 'right of', 'left of', 'over', 'as', 'loop', 'alt', 'else', 'opt'
  ];
  
  keywords.forEach(kw => {
    const reg = new RegExp(`\\b(${kw})\\b`, 'g');
    escaped = escaped.replace(reg, `<span class="token-keyword">$1</span>`);
  });

  // 4. Direction tokens (TD, LR, BT, RL)
  const directions = ['TD', 'LR', 'BT', 'RL'];
  directions.forEach(dir => {
    const reg = new RegExp(`\\b(${dir})\\b`, 'g');
    escaped = escaped.replace(reg, `<span class="token-direction">$1</span>`);
  });

  // 5. Arrow connectors
  const arrowRegex = /(-{2,}&gt;|==+&gt;|-\.-+&gt;|-\&gt;\&gt;|--+&gt;&gt;|-&gt;&gt;|--&gt;|--|&gt;&gt;|-\&gt;|-\.-+)/g;
  escaped = escaped.replace(arrowRegex, `<span class="token-arrow">$&</span>`);

  // 6. Node shape labels
  escaped = escaped.replace(/(\[.*?\]|\(.*?\)|{.*?})/g, `<span class="token-label">$&</span>`);

  // 7. Arrow inline text labels: |text|
  escaped = escaped.replace(/(\|.*?\|)/g, `<span class="token-arrow-label">$&</span>`);

  // Restore String variables
  strings.forEach((str, index) => {
    escaped = escaped.replace(`__STRING_${index}__`, `<span class="token-string">${str}</span>`);
  });

  // Restore Comment variables
  comments.forEach((cmt, index) => {
    escaped = escaped.replace(`__COMMENT_${index}__`, `<span class="token-comment">${cmt}</span>`);
  });

  return escaped;
};

// Variable helper because of transpilation
let index = 0;

function App() {
  // Navigation & Locale state
  const [activeTab, setActiveTab] = useState('journey');
  const [language, setLanguage] = useState('en');
  
  // Game state
  const [currentLevel, setCurrentLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [journeyCodes, setJourneyCodes] = useState({});
  const [wordWrap, setWordWrap] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Sandbox State
  const [sandboxCode, setSandboxCode] = useState(`graph TD
    Client[📱 Web Client] -->|API Requests| Gateway[⚡ API Gateway]
    Gateway -->|Auth Check| Microservice[🔒 Auth Service]
    Gateway -->|Fetch Coffee logs| Database[(🛢️ Coffee Log DB)]
`);
  const [sandboxTemplate, setSandboxTemplate] = useState('flowchart');

  // Compilation & Renderer state
  const [currentCode, setCurrentCode] = useState('');
  const [svgOutput, setSvgOutput] = useState('');
  const [compileError, setCompileError] = useState(null);
  const [senseiTip, setSenseiTip] = useState('');
  
  // UI states
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [justLevelUpData, setJustLevelUpData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);

  // References for synchronized scroll gutter and custom syntax highlighting overlays
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);
  const highlightRef = useRef(null);
  const compileTimeoutRef = useRef(null);

  // Translate helper shortcut
  const t = (key) => {
    const parts = key.split('.');
    let current = TRANSLATIONS[language];
    for (const part of parts) {
      if (current === undefined || current === null) return key;
      current = current[part];
    }
    return current !== undefined ? current : key;
  };

  // Load progress and language choice from localStorage on start
  useEffect(() => {
    try {
      const savedLevel = localStorage.getItem('mermaid_ninja_level');
      const savedXp = localStorage.getItem('mermaid_ninja_xp');
      const savedCompleted = localStorage.getItem('mermaid_ninja_completed');
      const savedCodes = localStorage.getItem('mermaid_ninja_codes');
      const savedLang = localStorage.getItem('mermaid_ninja_lang');
      const savedTheme = localStorage.getItem('mermaid_ninja_theme');

      if (savedLevel) setCurrentLevel(parseInt(savedLevel, 10));
      if (savedXp) setXp(parseInt(savedXp, 10));
      if (savedCompleted) setCompletedLevels(JSON.parse(savedCompleted));
      if (savedCodes) {
        const parsed = JSON.parse(savedCodes);
        setJourneyCodes(parsed);
      }
      if (savedLang) setLanguage(savedLang);
      
      if (savedTheme === 'dark') {
        setDarkMode(true);
        document.body.classList.add('dark-theme');
      } else {
        setDarkMode(false);
        document.body.classList.remove('dark-theme');
      }
    } catch (e) {
      console.error("Could not load progress from localStorage", e);
    }
  }, []);

  // Sync editor code with current level selection or active tab
  useEffect(() => {
    if (activeTab === 'journey') {
      const savedCode = journeyCodes[currentLevel];
      const initialCode = savedCode || CHALLENGES[currentLevel - 1]?.starterCode || '';
      setCurrentCode(initialCode);
      setSenseiTip(t('senseiGreeting'));
    } else if (activeTab === 'sandbox') {
      setCurrentCode(sandboxCode);
      setSenseiTip("Welcome to the Sandbox Dojo. Here you are free to design any diagram without restrictions!");
    }
    setCompileError(null);
    setSvgOutput('');
  }, [currentLevel, activeTab, language]);

  // Debounced Mermaid renderer compilation to prevent editor lag
  useEffect(() => {
    if (compileTimeoutRef.current) {
      clearTimeout(compileTimeoutRef.current);
    }

    if (!currentCode.trim()) return;

    compileTimeoutRef.current = setTimeout(() => {
      compileMermaid(currentCode);
    }, 450); // Debounce duration in ms

    return () => {
      if (compileTimeoutRef.current) {
        clearTimeout(compileTimeoutRef.current);
      }
    };
  }, [currentCode, language]);

  // Sync scroll positions of the left line gutter, textarea, and highlighted pre tag
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const scrollLeft = e.target.scrollLeft;
    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }
    if (highlightRef.current) {
      highlightRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
    }
  };

  // Intercept Tab key in the editor text area to insert four spaces
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target;
      const { selectionStart, selectionEnd, value } = textarea;
      
      const tabSpaces = '    '; // Four spaces for standard indentation
      const newValue = value.substring(0, selectionStart) + tabSpaces + value.substring(selectionEnd);
      
      handleCodeChange(newValue);
      
      // Reset the cursor position on the next tick
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + tabSpaces.length;
      }, 0);
    }
  };

  // Toggle Language Helper
  const changeLanguage = (lang) => {
    playClick();
    setLanguage(lang);
    localStorage.setItem('mermaid_ninja_lang', lang);
    showToast(lang === 'en' ? "Language set to English!" : "Sprache auf Deutsch umgestellt!");
  };

  // Toggle Theme Helper
  const toggleTheme = () => {
    playClick();
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    localStorage.setItem('mermaid_ninja_theme', nextTheme ? 'dark' : 'light');
    if (nextTheme) {
      document.body.classList.add('dark-theme');
      showToast(language === 'en' ? "Dark Mode activated!" : "Dunkler Modus aktiviert!");
    } else {
      document.body.classList.remove('dark-theme');
      showToast(language === 'en' ? "Light Mode activated!" : "Heller Modus aktiviert!");
    }
  };

  // Save journey codes as user types
  const handleCodeChange = (val) => {
    setCurrentCode(val);
    if (activeTab === 'journey') {
      const updated = { ...journeyCodes, [currentLevel]: val };
      setJourneyCodes(updated);
      localStorage.setItem('mermaid_ninja_codes', JSON.stringify(updated));
    } else if (activeTab === 'sandbox') {
      setSandboxCode(val);
    }
  };

  // Compile Mermaid function
  const compileMermaid = async (code) => {
    const renderId = 'mermaid-render-' + Math.floor(Math.random() * 1000000);
    try {
      // First, parse code to check syntactic validity safely
      await mermaid.parse(code);
      
      // If parse succeeds, render the SVG
      const { svg } = await mermaid.render(renderId, code);
      setSvgOutput(svg);
      setCompileError(null);
      
      // If in journey, give positive feedback
      if (activeTab === 'journey') {
        const isAlreadyComplete = completedLevels.includes(currentLevel);
        if (isAlreadyComplete) {
          setSenseiTip(t('senseiAlreadyMastered'));
        } else {
          setSenseiTip(t('senseiTipSuccess'));
        }
      }
    } catch (err) {
      console.warn("Mermaid renderer caught error:", err);
      const errText = err.str || err.message || "Mermaid compilation syntax error.";
      setCompileError(errText);
      setSvgOutput('');
      
      if (activeTab === 'journey') {
        setSenseiTip(t('senseiSpeechError'));
      }
    } finally {
      const badEl = document.getElementById(renderId);
      if (badEl) badEl.remove();
      const badBind = document.getElementById('d' + renderId);
      if (badBind) badBind.remove();
    }
  };

  // Reset starter code
  const resetToStarter = () => {
    playClick();
    if (activeTab === 'journey') {
      const starter = CHALLENGES[currentLevel - 1]?.starterCode || '';
      handleCodeChange(starter);
      showToast(t('toastReset'));
    } else if (activeTab === 'sandbox') {
      handleCodeChange('');
      showToast(t('toastClear'));
    }
  };

  // Show dynamic banner notifications
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Copy to clipboard
  const copyToClipboard = async (text, label, toastKey) => {
    playClick();
    try {
      await navigator.clipboard.writeText(text);
      showToast(t(toastKey));
    } catch (err) {
      showToast("Failed to copy code.");
    }
  };

  // Switch sandbox templates
  const applySandboxTemplate = (type) => {
    playClick();
    setSandboxTemplate(type);
    let template = '';
    switch (type) {
      case 'flowchart':
        template = `graph TD
    Start[🚀 Launch App] --> Decision{Is Offline?}
    Decision -->|Yes| LocalBkg[💾 Render Offline Sandbox]
    Decision -->|No| WarnClient[⚠️ Warning Popover]
    LocalBkg --> Finish[🏁 Process Finished]
    WarnClient --> Finish
`;
        break;
      case 'sequence':
        template = `sequenceDiagram
    actor Employee as 🧑‍💻 Employee
    actor Sensei as 🥷 Sensei
    
    Employee->>Sensei: Request Code Review
    activate Sensei
    Sensei-->>Employee: Analyze syntax rules
    deactivate Sensei
    
    rect rgb(30, 30, 56)
        note right of Sensei: Grading engine analyzes AST patterns
    end
    
    Sensei->>Employee: Award Belt & Fanfare Beeps!
`;
        break;
      case 'state':
        template = `stateDiagram-v2
    [*] --> Idle
    Idle --> Typing : User starts editing
    Typing --> Validating : Debounce active (450ms)
    Validating --> Valid : Parse success
    Validating --> SyntaxError : Parse throws exception
    SyntaxError --> Typing : User edits code
    Valid: --> PassedLevel : Clicks Grade & Passes Check
    PassedLevel --> [*]
`;
        break;
      case 'git':
        template = `gitGraph
    commit id: "Initial commit"
    commit id: "Add styling tokens"
    branch feature-dojo
    checkout feature-dojo
    commit id: "Build challenges engine"
    commit id: "Add sound effects"
    checkout main
    merge feature-dojo id: "Merge Dojo branch"
    commit id: "Production Release 1.0.0"
`;
        break;
      default:
        template = '';
    }
    setSandboxCode(template);
    setCurrentCode(template);
    showToast(`${t('toastTemplateLoaded')} (${type})`);
  };

  // Grade Code Function (Automated Challenge Reviewer)
  const gradeChallengeCode = () => {
    if (activeTab !== 'journey') return;
    
    if (compileError) {
      playFailure();
      setSenseiTip(language === 'en' 
        ? "Sensei says: I cannot grade code that does not compile! Look at the error box and fix your syntax first."
        : "Sensei sagt: Ich kann keinen Code prüfen, der nicht kompiliert! Behebe zuerst deine Syntaxfehler.");
      return;
    }

    const currentChallenge = CHALLENGES[currentLevel - 1];
    if (!currentChallenge) return;

    // Run technical validations returning syntax semantic key
    const reviewResult = currentChallenge.validate(currentCode);

    if (reviewResult.success) {
      const isFirstTime = !completedLevels.includes(currentLevel);
      
      let updatedXp = xp;
      let updatedCompleted = [...completedLevels];

      if (isFirstTime) {
        updatedXp += currentChallenge.xpReward;
        updatedCompleted.push(currentLevel);
        
        setXp(updatedXp);
        setCompletedLevels(updatedCompleted);
        
        localStorage.setItem('mermaid_ninja_xp', updatedXp.toString());
        localStorage.setItem('mermaid_ninja_completed', JSON.stringify(updatedCompleted));
      }

      playSuccess();
      setJustLevelUpData(currentChallenge);
      setShowLevelUp(true);
      
      setSenseiTip(language === 'en'
        ? `Sensational! You have mastered the ${t(`challenges.level${currentLevel}.name`)} challenges scroll! Claim your shuriken!`
        : `Sensationell! Du hast die Schriftrolle ${t(`challenges.level${currentLevel}.name`)} gemeistert! Beanspruche dein Shuriken!`);
    } else {
      playFailure();
      // Dynamically resolve localized validator error hint
      const localizedHint = t(`challenges.level${currentLevel}.hint.${reviewResult.hintKey}`);
      setSenseiTip(localizedHint);
    }
  };

  // Advance level helper
  const handleAdvanceLevel = () => {
    playLevelUp();
    setShowLevelUp(false);
    
    if (currentLevel < CHALLENGES.length) {
      const nextLvl = currentLevel + 1;
      setCurrentLevel(nextLvl);
      localStorage.setItem('mermaid_ninja_level', nextLvl.toString());
    } else {
      showToast(language === 'en' 
        ? "Congratulations! You are officially an Ultimate Black Belt Architect!"
        : "Herzlichen Glückwunsch! Du bist offiziell ein ultimativer Schwarzgurt-Architekt!");
    }
    setJustLevelUpData(null);
  };

  // Quick navigation helper
  const selectLevelDirectly = (lvl) => {
    playClick();
    const maxUnlocked = completedLevels.length + 1;
    if (lvl <= maxUnlocked) {
      setCurrentLevel(lvl);
      localStorage.setItem('mermaid_ninja_level', lvl.toString());
    } else {
      playFailure();
      setSenseiTip(language === 'en'
        ? `Sensei says: The path to level ${lvl} is locked. You must earn your previous belts first!`
        : `Sensei sagt: Der Weg zu Stufe ${lvl} ist gesperrt. Du musst zuerst deine vorherigen Gürtel erringen!`);
    }
  };

  // Split lines for line numbers gutter render
  const lineCount = Math.max(currentCode.split('\n').length, 1);
  const gutterNums = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Dynamic lists resolved directly from i18n JSON structures (0% hardcoded strings!)
  const checklistItems = TRANSLATIONS[language]?.challenges?.[`level${currentLevel}`]?.checklist || [];
  const spickzettelItems = TRANSLATIONS[language]?.challenges?.[`level${currentLevel}`]?.spickzettel || [];

  return (
    <div className="app-container">
      {/* 1. DOJO HEADER & SCOREBOARD */}
      <header className="dojo-header glass-panel">
        <div className="brand-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', transform: 'translateY(-2px)' }}>
            <svg width="45" height="45" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 8px var(--accent-teal))', animation: 'float 3.5s ease-in-out infinite' }}>
              <path d="M50,12 L58,37 L85,39 L65,56 L72,83 L50,68 L28,83 L35,56 L15,39 L42,37 Z" fill="url(#brandGrad)" stroke="var(--accent-teal)" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="14" fill="#0d0d1e" stroke="var(--accent-violet)" strokeWidth="2" />
              <path d="M50,42 L52,47 L57,50 L52,53 L50,58 L48,53 L43,50 L48,47 Z" fill="var(--accent-teal)" />
              <defs>
                <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-violet)" />
                  <stop offset="100%" stopColor="var(--accent-teal)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.1rem', fontWeight: 800 }}>{t('dojoTitle')}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              {t('dojoSub')}
            </p>
          </div>
        </div>

        {/* Gamified Scoreboard Dashboard */}
        <div className="scoreboard-card">
          {/* Language Toggle switcher */}
          <div className="scoreboard-item" style={{ marginRight: '0.5rem' }}>
            <span className="scoreboard-label">Language / Sprache</span>
            <div className="lang-switcher">
              <button 
                onClick={() => changeLanguage('en')}
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              >
                🇬🇧 EN
              </button>
              <button 
                onClick={() => changeLanguage('de')}
                className={`lang-btn ${language === 'de' ? 'active' : ''}`}
              >
                🇩🇪 DE
              </button>
            </div>
          </div>

          {/* Theme Switcher Toggle button */}
          <div className="scoreboard-item" style={{ marginRight: '0.5rem' }}>
            <span className="scoreboard-label">Theme / Farbschema</span>
            <button 
              onClick={toggleTheme}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                marginTop: '2px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
              }}
            >
              {darkMode ? <Sun size={14} style={{ color: '#ff4f00' }} /> : <Moon size={14} style={{ color: '#201515' }} />}
              {darkMode 
                ? (language === 'en' ? 'Light' : 'Hell') 
                : (language === 'en' ? 'Dark' : 'Dunkel')}
            </button>
          </div>

          <div className="scoreboard-item">
            <span className="scoreboard-label">{t('beltLabel')}</span>
            <span className="scoreboard-value" style={{ color: CHALLENGES[currentLevel - 1]?.level >= 5 ? 'var(--accent-rose)' : 'var(--accent-teal)' }}>
              {CHALLENGES[currentLevel - 1]?.beltEmoji} {t(`challenges.level${currentLevel}.name`)}
            </span>
          </div>

          <div className="scoreboard-item">
            <span className="scoreboard-label">{t('totalXp')}</span>
            <span className="scoreboard-value" style={{ color: 'var(--accent-gold)' }}>
              <Trophy size={18} style={{ color: 'var(--accent-gold)' }} />
              {xp} XP
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${Math.min((xp / (CHALLENGES.length * 100)) * 100, 100)}%` }}
                />
              </div>
            </span>
          </div>

          <div className="scoreboard-item" style={{ minWidth: '140px' }}>
            <span className="scoreboard-label">{t('unlockedBadges')}</span>
            <div className="badges-container">
              {CHALLENGES.map((ch) => {
                const isEarned = completedLevels.includes(ch.level);
                return (
                  <div 
                    key={ch.level} 
                    className={`badge-item ${isEarned ? 'active' : 'locked'}`}
                  >
                    <span>{isEarned ? ch.badgeEmoji : '🔒'}</span>
                    <div className="badge-tooltip">
                      {isEarned ? t(`challenges.level${ch.level}.badgeName`) : `${language === 'en' ? 'Locked' : 'Gesperrt'}: Level ${ch.level}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* 2. TAB NAVIGATION SYSTEM */}
      <nav className="tab-navigation">
        <button 
          onClick={() => { playClick(); setActiveTab('journey'); }}
          className={`tab-btn ${activeTab === 'journey' ? 'active' : ''}`}
        >
          <Flame size={16} />
          {t('journeyTab')} ({completedLevels.length}/5)
        </button>

        <button 
          onClick={() => { playClick(); setActiveTab('sandbox'); }}
          className={`tab-btn ${activeTab === 'sandbox' ? 'active' : ''}`}
        >
          <Code size={16} />
          {t('sandboxTab')}
        </button>

        <button 
          onClick={() => { playClick(); setActiveTab('cheatsheet'); }}
          className={`tab-btn ${activeTab === 'cheatsheet' ? 'active' : ''}`}
        >
          <BookOpen size={16} />
          {t('referenceTab')}
        </button>
      </nav>

      {/* 3. MAIN WORKSPACE CONTENT */}
      {activeTab === 'journey' && (
        <main className="dojo-workspace">
          {/* Level Switcher sidebar */}
          <section className="challenge-panel glass-panel glow-teal" style={{ position: 'relative' }}>
            <div className="ninja-star-bg">🥷</div>
            <div className="instructions-card-header">{t('curriculumHeader')}</div>
            
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {CHALLENGES.map((c) => {
                const isCompleted = completedLevels.includes(c.level);
                const isCurrent = currentLevel === c.level;
                const isUnlocked = c.level <= completedLevels.length + 1;
                
                return (
                  <button
                    key={c.level}
                    onClick={() => selectLevelDirectly(c.level)}
                    className={`curriculum-btn ${
                      isCurrent ? 'current' :
                      isCompleted ? 'completed' :
                      isUnlocked ? 'unlocked' : 'locked'
                    }`}
                    title={t(`challenges.level${c.level}.name`)}
                    disabled={!isUnlocked}
                  >
                    {isCompleted ? '✓' : c.level}
                  </button>
                );
              })}
            </div>

            <h2 className="challenge-title">
              <span>{CHALLENGES[currentLevel - 1]?.beltEmoji}</span>
              Level {currentLevel}: {t(`challenges.level${currentLevel}.name`)}
            </h2>

            <div className="story-text">
              {t(`challenges.level${currentLevel}.story`)}
            </div>

            <div className="mission-text">
              <div className="instructions-card-header" style={{ color: 'var(--accent-violet)' }}>{t('missionHeader')}</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {t(`challenges.level${currentLevel}.mission`)}
              </p>
              
              <div className="instructions-card-header" style={{ marginTop: '1.25rem', color: 'var(--accent-gold)' }}>{t('gradeReqs')}</div>
              <div className="mission-checklist">
                {checklistItems.map((item, idx) => {
                  const isCompleted = completedLevels.includes(currentLevel);
                  return (
                    <div key={idx} className={`checklist-item ${isCompleted ? 'done' : ''}`}>
                      <CheckCircle size={14} style={{ color: isCompleted ? 'var(--accent-teal)' : 'var(--text-muted)' }} />
                      <span>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* In-Context Spickzettel */}
            <div style={{ marginTop: '1rem' }}>
              <div className="instructions-card-header">{t('scrollCheatSheet')}</div>
              <table className="spickzettel-table">
                <thead>
                  <tr>
                    <th>{t('syntaxHeader')}</th>
                    <th>{t('resultHeader')}</th>
                  </tr>
                </thead>
                <tbody>
                  {spickzettelItems.map((s, idx) => (
                    <tr key={idx}>
                      <td><code className="spickzettel-code">{s.syntax}</code></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{s.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Middle Panel - Upgraded Overlay Real-Time Highlight Editor */}
          <section className="editor-panel glass-panel">
            <header className="panel-header">
              <h2 className="panel-title">
                <Code size={18} style={{ color: 'var(--accent-violet)' }} />
                {t('editorHeader')}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  onClick={() => { playClick(); setWordWrap(!wordWrap); }}
                  className={`btn-secondary ${wordWrap ? 'active' : ''}`}
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <span style={{ 
                    display: 'inline-block', 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    background: wordWrap ? 'var(--accent-teal)' : 'transparent', 
                    border: '1px solid var(--accent-teal)' 
                  }} />
                  {t('lineWrap')}
                </button>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {lineCount} lines
                </div>
              </div>
            </header>

            <div className="editor-wrapper">
              {/* Synced scroll line numbers column */}
              {!wordWrap && (
                <div className="editor-gutter" ref={gutterRef}>
                  {gutterNums.map((num) => (
                    <span key={num} className="editor-gutter-num">
                      {num}
                    </span>
                  ))}
                </div>
              )}

              {/* Layered Editor Container: transparent textarea sitting on top of pre tag */}
              <div className="editor-workspace-wrapper">
                <pre 
                  className="code-highlight" 
                  ref={highlightRef}
                  style={{
                    whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                    wordBreak: wordWrap ? 'break-word' : 'normal',
                    overflowWrap: wordWrap ? 'anywhere' : 'normal'
                  }}
                >
                  <code dangerouslySetInnerHTML={{ __html: highlightMermaid(currentCode) }} />
                </pre>
                
                <textarea
                  ref={textareaRef}
                  value={currentCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  onScroll={handleScroll}
                  onKeyDown={handleKeyDown}
                  className="code-textarea"
                  placeholder="Type your Mermaid code here..."
                  spellCheck="false"
                  style={{
                    whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                    wordBreak: wordWrap ? 'break-word' : 'normal',
                    overflowWrap: wordWrap ? 'anywhere' : 'normal'
                  }}
                />
              </div>
            </div>

            <div className="action-btns">
              <button 
                onClick={resetToStarter}
                className="btn-secondary"
              >
                <RotateCcw size={15} />
                {t('resetBtn')}
              </button>
              
              <button 
                onClick={() => copyToClipboard(currentCode, "Mermaid code", "toastCodeCopied")}
                className="btn-secondary"
              >
                <Copy size={15} />
                {t('copyCodeBtn')}
              </button>

              <button 
                onClick={gradeChallengeCode}
                className={completedLevels.includes(currentLevel) ? "btn-success" : "btn-primary"}
                style={{ marginLeft: 'auto' }}
              >
                <CheckCircle size={15} />
                {completedLevels.includes(currentLevel) ? t('reviewGradeBtn') : t('gradeSubmitBtn')}
              </button>
            </div>
          </section>

          {/* Right Panel - Render Preview */}
          <section className="canvas-panel glass-panel">
            <header className="panel-header">
              <h2 className="panel-title">
                <Sparkles size={18} style={{ color: 'var(--accent-teal)' }} />
                {t('livePreviewHeader')}
              </h2>
              {compileError ? (
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  ⚠️ {t('errorAlert')}
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontWeight: 'bold' }}>
                  ✓ {t('compiledAlert')}
                </span>
              )}
            </header>

            <div className="canvas-viewport">
              {compileError ? (
                <div className="canvas-error-alert">
                  <div className="canvas-error-title">
                    <Info size={16} />
                    <span>{t('syntaxAlertTitle')}</span>
                  </div>
                  <pre className="canvas-error-desc">{compileError}</pre>
                </div>
              ) : svgOutput ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: svgOutput }} 
                  style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                />
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                  <p>{t('awaitingInput')}</p>
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {activeTab === 'sandbox' && (
        <main className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t('sandboxTitle')}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {t('sandboxSub')}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('loadTemplate')}</span>
              {['flowchart', 'sequence', 'state', 'git'].map((tName) => (
                <button
                  key={tName}
                  onClick={() => applySandboxTemplate(tName)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    border: sandboxTemplate === tName ? '1px solid var(--accent-teal)' : '1px solid var(--border-color)',
                    background: sandboxTemplate === tName ? 'rgba(255, 79, 0, 0.12)' : 'var(--bg-secondary)',
                    color: sandboxTemplate === tName ? 'var(--accent-teal)' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tName}
                </button>
              ))}
            </div>
          </header>

          <div className="sandbox-editor-grid">
            {/* Custom sandbox editor with gutter & live highlights */}
            <div className="editor-panel">
              <div className="editor-wrapper">
                {!wordWrap && (
                  <div className="editor-gutter" ref={gutterRef}>
                    {gutterNums.map((num) => (
                      <span key={num} className="editor-gutter-num">
                        {num}
                      </span>
                    ))}
                  </div>
                )}

                <div className="editor-workspace-wrapper">
                  <pre 
                    className="code-highlight" 
                    ref={highlightRef}
                    style={{
                      whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                      wordBreak: wordWrap ? 'break-word' : 'normal',
                      overflowWrap: wordWrap ? 'anywhere' : 'normal'
                    }}
                  >
                    <code dangerouslySetInnerHTML={{ __html: highlightMermaid(currentCode) }} />
                  </pre>

                  <textarea
                    value={currentCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    onScroll={handleScroll}
                    onKeyDown={handleKeyDown}
                    className="code-textarea"
                    placeholder="Draft your custom diagram code..."
                    spellCheck="false"
                    style={{
                      whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                      wordBreak: wordWrap ? 'break-word' : 'normal',
                      overflowWrap: wordWrap ? 'anywhere' : 'normal'
                    }}
                  />
                </div>
              </div>
              
              <div className="action-btns">
                <button onClick={resetToStarter} className="btn-secondary">
                  {t('clearSandboxBtn')}
                </button>
                <button onClick={() => copyToClipboard(currentCode, "Sandbox Mermaid code", "toastCodeCopied")} className="btn-secondary">
                  {t('copyMarkdownBtn')}
                </button>
                
                <button 
                  onClick={() => { playClick(); setWordWrap(!wordWrap); }}
                  className={`btn-secondary ${wordWrap ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <span style={{ 
                    display: 'inline-block', 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    background: wordWrap ? 'var(--accent-teal)' : 'transparent', 
                    border: '1px solid var(--accent-teal)' 
                  }} />
                  {t('lineWrap')}
                </button>

                <button 
                  onClick={() => {
                    if (svgOutput) {
                      copyToClipboard(svgOutput, "Diagram SVG XML", "toastSvgCopied");
                    } else {
                      showToast("No rendered SVG available to copy.");
                    }
                  }} 
                  className="btn-primary"
                  disabled={!!compileError || !svgOutput}
                  style={{ marginLeft: 'auto' }}
                >
                  {t('copySvgBtn')}
                </button>
              </div>
            </div>

            {/* Rendering preview column */}
            <div className="canvas-panel">
              <div className="canvas-viewport" style={{ minHeight: '450px' }}>
                {compileError ? (
                  <div className="canvas-error-alert">
                    <div className="canvas-error-title">
                      <Info size={16} />
                      <span>{t('syntaxAlertTitle')}</span>
                    </div>
                    <pre className="canvas-error-desc">{compileError}</pre>
                  </div>
                ) : svgOutput ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: svgOutput }} 
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                  />
                ) : (
                  <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                    {t('awaitingInput')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {activeTab === 'cheatsheet' && (
        <main className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t('refTitle')}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {t('refSub')}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Accordion 1: Flowcharts */}
            <div className="spickzettel-accordion">
              <button 
                onClick={() => { playClick(); setActiveAccordion(activeAccordion === 0 ? null : 0); }}
                className="spickzettel-accordion-trigger"
              >
                <span>{t('refSection1')}</span>
                <ChevronDown size={18} style={{ transform: activeAccordion === 0 ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>
              
              {activeAccordion === 0 && (
                <div className="spickzettel-accordion-content">
                  <table className="spickzettel-table" style={{ fontSize: '0.9rem' }}>
                    <thead>
                      <tr>
                        <th>Visual Shape</th>
                        <th>Syntax</th>
                        <th>Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Rectangle</td>
                        <td><code>[Text]</code></td>
                        <td><code>node1[Simple Step]</code></td>
                      </tr>
                      <tr>
                        <td>Round Rect</td>
                        <td><code>(Text)</code></td>
                        <td><code>node2(Start App)</code></td>
                      </tr>
                      <tr>
                        <td>Cylinder (DB)</td>
                        <td><code>[(Text)]</code></td>
                        <td><code>db[(Relational Database)]</code></td>
                      </tr>
                      <tr>
                        <td>Diamond (Decision)</td>
                        <td><code>{"{Text}"}</code></td>
                        <td><code>dec1{"{Is User Valid?}"}</code></td>
                      </tr>
                      <tr>
                        <td>Circle</td>
                        <td><code>((Text))</code></td>
                        <td><code>c1((Perfect Circle))</code></td>
                      </tr>
                    </tbody>
                  </table>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    <strong>Tip:</strong> Always use letters or numbers for your node IDs (e.g. <code>step1</code>, <code>db</code>), and then use parentheses/brackets to define the text that shows up inside the node. That keeps your connections neat!
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 2: Sequences */}
            <div className="spickzettel-accordion">
              <button 
                onClick={() => { playClick(); setActiveAccordion(activeAccordion === 1 ? null : 1); }}
                className="spickzettel-accordion-trigger"
              >
                <span>{t('refSection2')}</span>
                <ChevronDown size={18} style={{ transform: activeAccordion === 1 ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>
              
              {activeAccordion === 1 && (
                <div className="spickzettel-accordion-content">
                  <table className="spickzettel-table" style={{ fontSize: '0.9rem' }}>
                    <thead>
                      <tr>
                        <th>Arrow Style</th>
                        <th>Syntax</th>
                        <th>Meaning</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Solid Arrow</td>
                        <td><code>-&gt;</code></td>
                        <td>Asynchronous Message</td>
                      </tr>
                      <tr>
                        <td>Solid Arrow + Arrowhead</td>
                        <td><code>-&gt;&gt;</code></td>
                        <td>Synchronous Request</td>
                      </tr>
                      <tr>
                        <td>Dotted Line</td>
                        <td><code>--&gt;</code></td>
                        <td>Asynchronous Reply</td>
                      </tr>
                      <tr>
                        <td>Dotted Line + Arrowhead</td>
                        <td><code>--&gt;&gt;</code></td>
                        <td>Synchronous Reply / Response</td>
                      </tr>
                    </tbody>
                  </table>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    <strong>Example Structure:</strong><br />
                    <pre className="spickzettel-pre">
{`sequenceDiagram
  participant Alice
  participant Bob
  Alice->>Bob: Hello Bob!
  Bob-->>Alice: Hi Alice!`}
                    </pre>
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 3: GitGraphs */}
            <div className="spickzettel-accordion">
              <button 
                onClick={() => { playClick(); setActiveAccordion(activeAccordion === 2 ? null : 2); }}
                className="spickzettel-accordion-trigger"
              >
                <span>{t('refSection3')}</span>
                <ChevronDown size={18} style={{ transform: activeAccordion === 2 ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>
              
              {activeAccordion === 2 && (
                <div className="spickzettel-accordion-content">
                  <table className="spickzettel-table" style={{ fontSize: '0.9rem' }}>
                    <thead>
                      <tr>
                        <th>Operation</th>
                        <th>Syntax</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Start Graph</td>
                        <td><code>gitGraph</code></td>
                        <td>Initializes a git history chart</td>
                      </tr>
                      <tr>
                        <td>Commit</td>
                        <td><code>commit</code></td>
                        <td>Adds a standard commit node to the current branch</td>
                      </tr>
                      <tr>
                        <td>Named Commit</td>
                        <td><code>commit id: "fix"</code></td>
                        <td>Adds a custom tagged commit with tag 'fix'</td>
                      </tr>
                      <tr>
                        <td>Create Branch</td>
                        <td><code>branch dev</code></td>
                        <td>Creates a new branch named 'dev' off current branch</td>
                      </tr>
                      <tr>
                        <td>Switch Branch</td>
                        <td><code>checkout dev</code></td>
                        <td>Switches active commit focus to 'dev' branch</td>
                      </tr>
                      <tr>
                        <td>Merge Branch</td>
                        <td><code>merge dev</code></td>
                        <td>Merges commits from 'dev' branch back to active branch</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* 4. SENSEI SPEECH CONSOLE BANNER */}
      <footer className="sensei-console">
        <div className="sensei-avatar-wrapper">
          <div className="sensei-avatar" style={{ border: 'none', background: 'transparent', animation: 'none', width: '75px', height: '75px' }}>
            <svg viewBox="0 0 100 100" width="75" height="75" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 79, 0, 0.35))' }}>
              <circle cx="50" cy="50" r="46" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="2, 2" />
              
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--accent-teal)" strokeWidth="1.5" strokeDasharray="6, 6" style={{ transformOrigin: '50% 50%', animation: 'rotateDashed 24s linear infinite' }} />
              
              <path d="M26,45 C26,24 74,24 74,45 C74,70 65,78 50,83 C35,78 26,70 26,45 Z" fill="var(--accent-violet)" stroke="var(--border-color)" strokeWidth="2.5" />
              
              <path d="M30,35 Q50,22 70,35 L71,43 Q50,30 29,43 Z" fill="var(--accent-violet)" stroke="var(--accent-teal)" strokeWidth="1" />
              <circle cx="50" cy="33" r="2" fill="var(--accent-teal)" />
              
              <path d="M32,45 C40,43 60,43 68,45 L66,49 C58,47 42,47 34,49 Z" fill="var(--accent-teal)" />
              <circle cx="50" cy="46" r="1.5" fill="#fff" style={{ filter: 'drop-shadow(0 0 3px #fff)' }} />
              
              <path d="M38,58 Q50,62 62,58 L60,70 Q50,80 40,70 Z" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
              
              <line x1="46" y1="61" x2="46" y2="73" stroke="var(--border-color)" strokeWidth="1" />
              <line x1="50" y1="62" x2="50" y2="74" stroke="var(--border-color)" strokeWidth="1" />
              <line x1="54" y1="61" x2="54" y2="73" stroke="var(--border-color)" strokeWidth="1" />
            </svg>
          </div>
          <div className="sensei-label" style={{ marginTop: '0.25rem' }}>{language === 'en' ? 'Mermaid Sensei' : 'Mermaid-Sensei'}</div>
        </div>

        <div className="sensei-speech-bubble">
          <p className="sensei-speech-text" style={{ color: compileError ? '#fda4af' : 'var(--text-main)' }}>
            {senseiTip}
          </p>
          {compileError && (
            <div className="sensei-criticism">
              {t('senseiHumming')}
            </div>
          )}
        </div>
      </footer>

      {/* 5. SUCCESS CELEBRATION LEVEL-UP MODAL */}
      {showLevelUp && justLevelUpData && (
        <div className="level-up-modal">
          <div className="level-up-content">
            <span className="level-up-badge">{justLevelUpData.badgeEmoji}</span>
            <h2 className="level-up-title">{t('modalTitle')}</h2>
            <p className="level-up-desc">
              {t('modalDesc')}
            </p>
            <div 
              style={{ 
                background: 'rgba(250, 204, 21, 0.12)', 
                border: '1.5px solid var(--accent-gold)', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '8px', 
                fontWeight: 'bold', 
                color: 'var(--accent-gold)' 
              }}
            >
              {t('modalBadgeUnlocked')} {t(`challenges.level${justLevelUpData.level}.badgeName`)} (+100 XP)
            </div>
            
            <button 
              onClick={handleAdvanceLevel} 
              className="btn-primary" 
              style={{ background: 'linear-gradient(135deg, var(--accent-gold), #b45309)', color: '#000', fontWeight: 'bold', display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
            >
              <span>{currentLevel < CHALLENGES.length ? t('modalAdvanceBtn') : t('modalClaimFinalBtn')}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Banner Toast Alerts */}
      {toastMessage && (
        <div className="toast-success">
          <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
