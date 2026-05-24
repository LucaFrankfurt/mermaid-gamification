# 🥷 Mermaid Ninja Dojo

An interactive, gamified offline training platform designed to guide corporate teams through mastering text-to-diagramming with **Mermaid.js**. The "Dojo" takes apprentices from complete beginners to master system architects (**Black Belts**) via interactive code challenges, strict local syntax compilers, and a premium 8-bit audio-visual experience.

Built with an **offline-first, zero-external-network design**, this platform is 100% compliant with secure corporate environments and strict air-gapped intranet networks.

---

## 🎯 Platform Objectives & Mission

Corporate workflows are often bogged down by static, mouse-heavy drawing tools (like Visio or Paint) which are difficult to version-control and maintain. The **Mermaid Ninja Dojo** gamifies the learning path for **4,000+ corporate employees** to master Mermaid.js:
1. **0% External Assets / API calls**: Strictly compiles and renders Mermaid diagrams in the client's browser offline. No kroki.io, mermaid.live, or Google CDN calls.
2. **Data Sandbox Isolation**: All validation runs locally. Never prompts users for real credentials or private production data.
3. **Advanced Ergonomics**: Integrated overlay editor with custom tab-interception, scroll synchronization, syntax highlighting, a dynamic **Line Wrap / Zeilenumbruch** toggle, and a custom-branded **Dark Mode** toggle.
4. **Seamless Localization**: Fully decoupled i18n structure supporting **English** and **German** languages out of the box with zero hardcoded UI strings.

---

## 🛠️ Key Technical Features

### 1. Retro 8-Bit Audio-Synthesizer (`soundEffects.js`)
To provide tactile, nostalgic gamification feedback without bloating the application with audio files, we engineered a native **Web Audio API synthesizer**:
- **Zero Asset Downloads**: Oscillators generate retro sound effects programmatically.
- **Dynamic Chords**: Supports high-fidelity audio feedback for **Click**, **Success (level-up fanfares)**, **Error (dull tone)**, and **Claiming Badges**.

### 2. High-Fidelity Layered Highlight Editor
An advanced text editor built from scratch without bulky external packages (like Monaco or CodeMirror):
- **Transparent Overlapping Editor**: A transparent `<textarea>` sits directly above a syntax-highlighted `<pre><code>` block.
- **Scroll Synchronization**: Offsets for scrolling and horizontal movements are programmatically synchronized across the line numbers gutter, highlighting block, and text area.
- **Smart Interceptions**: Tab keys are captured and converted into standard 4-space indentations.
- **Line Wrap Toggle**: A stateful button dynamically sets `white-space: pre-wrap` and hides the gutter numbers to prevent misalignment when long labels wrap.

### 3. Decoupled Gamification Engine
- **Logical Rules (`challenges.js`)**: Technical criteria and checks are decoupled from UI localization copies. They evaluate code strings and return semantic result keys.
- **Dynamic Localization Lookup**: The application takes logical keys (e.g., `hintKey: "link1"`) and dynamically matches them to localized tips (`challenges.level1.hint.link1`) from English (`en.js`) or German (`de.js`) modules.

---

## 📂 Project Architecture

```
mermaid-gamification/
├── README.md               # Extensive project documentation & architecture guide
├── index.html              # Core application entrypoint (offline-ready)
├── package.json            # Node project configuration
├── vite.config.js          # Vite assets compiler settings
├── src/
│   ├── main.jsx            # React root mount script
│   ├── App.jsx             # Core Dojo app shell, layout controller & UI views
│   ├── index.css           # Premium Warm-Cream & Coffee-Charcoal Design System
│   ├── challenges.js       # Curriculum criteria check code (Logical rules)
│   ├── soundEffects.js     # Native Web Audio API programatic sound synths
│   └── i18n/               # Multi-language translation packs
│       ├── en.js           # English dictionaries (Challenges & UI strings)
│       ├── de.js           # German dictionaries (Challenges & UI strings)
│       └── i18n.js         # Dictionary compiler configuration
```

---

## 🥋 The 5-Level Ninja Journey

Employees progress through a highly stylized layout to claim custom-crafted local badges:

| Belt Level | Shuriken Badge | Concept Mastered | Scenario Covered |
| :--- | :--- | :--- | :--- |
| **⚪ White Belt** | `The Coffee Whiz Shuriken` | Flowcharts & Top-Down Directions (`graph TD`) | The legendary 3rd-floor Coffee Machine Protocol |
| **🟡 Yellow Belt** | `The Master of Decisions` | Decision Diamonds (`{}`) & Inline Path Labels | Recovering the missing Production Password Post-It |
| **🟢 Green Belt** | `The Subgraph General` | Subgraph Networks (`subgraph ... end`) & Database Shapes | Isolating the Coffee Logs DB in secure HQ networks |
| **🔵 Blue Belt** | `The Sequence Choreographer` | Sequence Actors (`sequenceDiagram`) & Message Arrows | Automating the API access email handshake protocol |
| **⚫ Black Belt** | `The Ultimate Git Shogun` | Git Branching Graphs (`gitGraph`), Commits & Merges | Restoring production coffee ratio via branch hotfixes |

---

## 🚀 Installation & Local Development

To run or build the workspace locally:

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 1. Install dependencies
Run this inside the project root to install the localized copy of **Mermaid.js** and **Lucide React** icons:
```bash
npm install
```

### 2. Launch Local Dev Server
Start the high-performance local dev server with HMR:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

### 3. Compile for Production Deployment
Generate optimized, fully bundled static assets ready for corporate intranet servers or secure file hosts:
```bash
npm run build
```
Vite compiles and outputs the production bundle into the `dist/` directory in under a second. The resulting package contains **zero** external network dependencies.

---

## 🌎 Localization System (i18n)

Adding new language translations is incredibly straightforward. Simply create or update files inside the `src/i18n/` folder.

All UI strings and technical challenge tips must be added to both language files to prevent fallback mismatches:
- **English**: `src/i18n/en.js`
- **German**: `src/i18n/de.js`

Example insertion of a new UI translation key:
```javascript
// src/i18n/en.js
export default {
  myCoolFeature: "Feature Name",
  ...
}

// src/i18n/de.js
export default {
  myCoolFeature: "Feature-Name",
  ...
}
```

Usage in the React Components:
```jsx
<span>{t('myCoolFeature')}</span>
```

---

## 🔒 Security & Offline Compliance Statement

This application is strictly engineered to execute in isolated sandbox environments:
- **Zero Third-Party CDNs**: All styling, logic, scripts, and libraries are locally bundled during build time.
- **Browser-Only Storage**: Progress, XP values, completed level lists, and coded diagrams are stored directly in the user's `localStorage`. No remote server or database is queried.
- **Web Audio API**: All sounds are synthesised dynamically on the client's audio card. No audio assets are fetched.
