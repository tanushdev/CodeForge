# CodeForge Design System & UI Specification

This document defines the user interface, layout, typography, colors, and key pages of the CodeForge Data Structures and Algorithms (DSA) tracker. It is structured to serve as a direct guide for generating matching UI screens in Stitch.

## Branding & Vibe
- **Brand Name**: CodeForge
- **Sub-tagline**: "Made By Tanush"
- **Style Concept**: High-tech, dark mode, developer-centric, clean typography, vibrant neon highlights, and premium card layouts.

---

## 1. Color Palette & Styling Tokens

### Core Colors
- **Background**: `#05070d` (Deep space dark)
- **Primary Panel**: `#0d111c` (Solid slate container)
- **Secondary Panel**: `#121827` (Slightly lighter slate)
- **Tertiary Panel**: `#151d2d` (Fitted details container)
- **Border / Grid Lines**: `rgba(255, 255, 255, 0.1)` (Subtle white borders)

### Typography & Ink
- **Text Primary**: `#f5f7fb` (Off-white, highly legible)
- **Text Secondary / Muted**: `#9aa6ba` (Slate gray for descriptions, metadata)

### Accents & Indicators
- **Accent Primary (Cyan)**: `#38d6b4` (Brand highlights, progress bars, active states)
- **Accent Secondary (Gold)**: `#f3b95f` (Warning alerts, medium difficulty)
- **Accent Tertiary (Blue)**: `#8fb4ff` (Information highlights, easy difficulty)
- **Success / Completed**: `#55d47a` (Solved missions, unlocked states)
- **Danger / Failure**: `#ff7381` (Locked states, delete actions)

---

## 2. Layout & Global Structure

### Main Shell
- Max width: `1320px` (centered).
- Structured with a persistent **Sidebar Navigation** on the left and a **Main Content Area** on the right.

### Persistent Sidebar
- **Header**: Contains the CodeForge logo (A styled block containing the letter "D" in Cyan) and brand typography. Below is the tagline: "Made By Tanush".
- **Navigation Links**:
  - Dashboard (Home)
  - Algorithms
  - System Design
  - Review / Mock Interviews
  - Labs
  - Resources
- **Footer**: User profile info and Logout button.

---

## 3. Screen Specifications

### Screen A: Welcome & Authentication Page
- **Visuals**: Centered card layout with a linear gradient background. Large branding text "CodeForge" and "Made By Tanush".
- **Form**: Tabbed Login and Signup forms. Requires email and password. Focus states on input fields highlight in Cyan (`#38d6b4`).

### Screen B: Main Dashboard
- **Top Bar**: Displays a greeting (e.g., "Welcome back, Developer") along with a radial progress ring showing overall algorithm completion percentage.
- **Widgets**:
  - **Daily Mission Card**: A highlighted algorithm card showing an active challenge to complete.
  - **Quick Stats Grid**: Mini metrics cards showing: Total Solved, Active Streak (days), and Hours Studied.
  - **Recent Activity**: A list of recently completed problems with status badges (e.g., "Linked List Cycle" - Completed 2 hours ago).

### Screen C: Algorithms Explorer
- **Sidebar Filters**: Sort by difficulty (Easy, Medium, Hard) or status (To Do, In Progress, Completed).
- **Problems Table/Grid**: List of algorithms with columns:
  - Status indicator (Checkmark circle or lock icon)
  - Problem name (e.g., "Merge Intervals")
  - Topic category (e.g., "Arrays & Hashing")
  - Difficulty badge (colored by complexity)
  - Action button to "Unlock" or "Launch Lab"

### Screen D: Interactive Lab (The Workspace)
- **Splitscreen Layout**:
  - **Left Panel (Theory & Guide)**: Contains algorithm explanation, pseudocode block, complexity tables (Time/Space O-notation), and handwritten diagram drawings placeholder.
  - **Right Panel (Playground)**:
    - Interactive dry-run stepper controls (Back, Step Forward, Play, Reset).
    - Code editor wrapper showing JavaScript implementation.
    - Debug console outputting active execution state (e.g., `merged = [[1,6], [8,10]]`).
