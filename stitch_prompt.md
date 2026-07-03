# CodeForge UI Specification & Prompt

This document defines the user interface layout, design system, component hierarchy, and screen mockups for **CodeForge** (an interactive DSA tracker and learning console). Use this specification to generate premium, high-fidelity React screens in Stitch.

---

## 1. Design System & Style Tokens

### Aesthetic Concept
A premium, hacker-themed developer console. It uses a high-contrast dark theme with glassmorphic cards, glowing borders, vibrant neon indicators, and crisp monospaced code blocks.

### Color Palette (Dark Theme Default)
- **Backgrounds**:
  - Base: `#0B0F19` (Deep obsidian blue)
  - Surface/Card: `#151B2E` (Semi-transparent dark slate)
  - Popover/Tooltip: `#1E294B` (Midnight indigo)
- **Brand Colors**:
  - Primary / Accent Cyan: `#00F2FE` (Glowing cyber cyan)
  - Secondary / Accent Purple: `#9d4edd` (Vaporwave purple)
  - Success Green: `#10B981` (Emerald green for unlocked/solved)
  - Warning Orange: `#F59E0B` (Amber for in-progress or medium difficulty)
  - Muted Text: `#64748B` (Cool gray)
  - Body Text: `#E2E8F0` (Off-white)

### Typography
- **Headings**: `Outfit` or `Inter`, sans-serif (Bold, clean letter-spacing)
- **Body & Controls**: `Inter`, sans-serif (Optimized for readability)
- **Monospace (Code & Diagnostics)**: `JetBrains Mono` or `Fira Code`

---

## 2. Shared Layout: App Shell & Sidebar

The layout uses a persistent Left Sidebar on desktop and a collapsable bottom drawer on mobile.

```
+--------------------------------------------------------+
|  LOGO  |                                               |
|  Menu  |                  MAIN CONTENT                 |
|  - Home|                                               |
|  - Map |                                               |
|  - Labs|                                               |
|        |                                               |
| PROFILE|                                               |
+--------------------------------------------------------+
```

### Sidebar Component
- **Logo Area**: A stylized letter "D" inside a neon cyan circle `#00F2FE` with the name **CodeForge** next to it, accompanied by a small sub-caption: `Made By Tanush`.
- **Navigation Links**:
  - Dashboard (Overview, Streak, Quick Actions)
  - Learning Roadmap (Pathways & levels)
  - Theory & Lessons (Conceptual guides)
  - Coding Labs (Interactive execution and code playground)
  - System Design (Interview scoring rubrics)
  - Review Space (Spaced repetition cards)
  - Resources (Cheat sheets)
- **Footer**: User profile avatar card with logout button.

---

## 3. Core Screens Specification

### Screen 1: Welcome / Landing Page (`/welcome`)
- **Hero Section**:
  - High-tech geometric pattern in the background.
  - Large title: `CodeForge` (Gradient text: Cyan to Purple).
  - Subtitle: `Made By Tanush` (Neon cyan badge).
  - Description: "Master algorithms like a game. Levels, theory, dry runs, algorithm code, and solve-to-unlock missions."
- **Action Buttons**:
  - "Start Journey" (Primary glowing button: transitions to `/signup`).
  - "Continue Mission" (Secondary bordered button: transitions to `/login`).

### Screen 2: Student Dashboard (`/dashboard`)
- **Top Row Statistics**:
  - **Streak Tracker**: Card displaying active consecutive study days with a flame icon.
  - **Missions Completed**: Progress ring showing `12/36` topics mastered.
  - **Global Ranking**: Level status badge (e.g., "Intermediate Scripter").
- **Middle Section**:
  - **Active Mission Card**: Quick resume button pointing to the last visited lesson or coding lab.
  - **Weekly activity chart**: Minimal bar graph representing time spent coding per day.
- **Recent Activity Feed**:
  - List of recent attempts (e.g., "Two Sum - Solved (90%)", "KMP Search - Read (100%)").

### Screen 3: Interactive Learning Roadmap (`/roadmap`)
- **Map Nodes Layout**:
  - Vertical node connections representing chapters or checkpoints.
  - Completed nodes: Glowing emerald green with connection lines.
  - Locked nodes: Semi-opaque with a lock icon.
- **Stages**:
  - **Stage 1**: Arrays & Hashing
  - **Stage 2**: Two Pointers & Sliding Window
  - **Stage 3**: Trees & Graphs
  - **Stage 4**: Dynamic Programming
  - **Stage 5**: System Design Core

### Screen 4: Algorithm Lessons & Theory (`/lessons`)
- **Split Screen Layout**:
  - **Left Pane**: Explanations (Time/Space complexities in badges, bulleted theory notes, expandable real-world examples).
  - **Right Pane**: Interactive dry-run simulator.
- **Dry-run Table**:
  - A step-by-step navigation controller (`[Prev] Step 3/10 [Next]`).
  - Highlights lines of code in real-time as state values (pointers, index values, arrays) update in a table below.

### Screen 5: Coding Labs / Playground (`/labs`)
- **IDE Layout**:
  - **Header**: Problem description, input/output constraints, and difficulty level (Easy/Medium/Hard).
  - **Code Editor Area**: High-fidelity dark mode editor (Monospace font, simulated syntax highlighting for JS/Python).
  - **Test Case Panel**: Custom input boxes where users can write custom arrays or strings to dry run.
  - **Action Controls**:
    - "Run Dry Run" (Console log output drawer).
    - "Submit Mission" (Runs automated grading checks against rubrics).

### Screen 6: System Design Sandbox (`/system-design`)
- **Sidebar Selector**: Select a system scenario (e.g., "TinyURL", "API Rate Limiter", "Video Streaming").
- **Requirements Inputs**:
  - Functional & scale constraints template checklist.
  - Architecture sandbox interface or interactive rubrics grading.
- **Automatic Scoring Panel**:
  - Real-time feedback bar analyzing student designs against core components like consistent hashing, CDNs, and database sharding.
