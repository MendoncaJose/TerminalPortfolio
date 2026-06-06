# JOSE.SYS — Terminal Portfolio

> A frontend portfolio that boots like a system, navigates like a dashboard, and leaves an impression.

---

<!-- SCREENSHOT: Full dashboard view (desktop) -->
<!-- ![Dashboard](./video-frames/frame-01.jpg) -->

---

## Overview

**JOSE.SYS** is a browser-based portfolio for Jose Mendonca, built as an interactive terminal-inspired dashboard. Instead of a scroll-down landing page, visitors navigate between panels — Profile, Projects, and Contact — inside a dark, CRT-filtered, cyber-industrial interface.

The goal: a recruiter or engineering lead can explore skills, projects, and contact routes in under a minute, and remember the interface as technical and deliberate.

---

## Features

- **Boot sequence** — animated system startup with progress bars before the main UI loads
- **Matrix intro screen** — canvas-rendered falling characters as an entry point
- **Three-panel dashboard** — fixed-height desktop layout with sidebar navigation, main viewer, and terminal shell
- **Dither shader** — profile image rendered in real-time with a retro dithering effect via WebGL
- **Interactive terminal shell** — right-side panel with fake system responses and blinking cursor
- **CRT overlay** — scanline and chromatic aberration filter over the entire viewport
- **Project cards** — paginated project list with tags, metadata, and hover states
- **Contact transmission panel** — styled form with send feedback states
- **Responsive** — stacks vertically on mobile, compact mode on short viewports

---

<!-- SCREENSHOT: Boot sequence / intro -->
<!-- Replace path below with your screenshot -->
<!-- ![Boot](./video-frames/frame-02.jpg) -->

---

<!-- SCREENSHOT: Profile view -->
<!-- ![Profile](./video-frames/frame-03.jpg) -->

---

<!-- SCREENSHOT: Projects view -->
<!-- ![Projects](./video-frames/frame-04.jpg) -->

---

<!-- SCREENSHOT: Contact view -->
<!-- ![Contact](./video-frames/frame-05.jpg) -->

---

<!-- SCREENSHOT: Mobile layout -->
<!-- ![Mobile](./video-frames/frame-06.jpg) -->

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS v4 + hand-written CSS |
| 3D / Shader | WebGL (dither shader via custom canvas component) |
| Fonts | JetBrains Mono, Fira Code |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── components/
│   ├── IntroScreen.tsx        # Matrix canvas entry screen
│   ├── BootSequence.tsx       # Animated system boot
│   ├── DashboardLayout.tsx    # Three-panel grid shell
│   ├── HeaderStatusBar.tsx    # Top bar with brand and clock
│   ├── StatusFooter.tsx       # Bottom status bar
│   ├── SidebarNavigation.tsx  # Left nav buttons
│   ├── SystemMonitor.tsx      # CPU/RAM bars + micro log
│   ├── MainViewer.tsx         # Panel router (profile/projects/contact)
│   ├── TerminalShell.tsx      # Right-side fake terminal
│   ├── ProjectCard.tsx        # Single project card
│   ├── SkillMatrix.tsx        # Skill icon grid
│   ├── ContactPanel.tsx       # Contact channels + form
│   ├── VimEditorModal.tsx     # Vim-style modal overlay
│   ├── MatrixIntro.tsx        # Canvas matrix rain
│   ├── Panel.tsx              # Reusable panel wrapper
│   └── ui/
│       └── DitherShader.tsx   # WebGL dither renderer
├── data.ts                    # All content (projects, skills, logs)
├── types.ts                   # Shared TypeScript types
├── styles.css                 # All custom CSS
├── App.tsx
└── main.tsx
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Install

```bash
npm install
```

### Dev server

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build

```bash
npm run build
```

Output goes to `dist/`.

### Preview production build

```bash
npm run preview
```

---

## Customisation

All portfolio content lives in `src/data.ts`. Edit that file to change:

- Name, title, bio
- Skills and their icons
- Project list (title, description, tags, links, status)
- Terminal shell responses
- Activity log entries
- Contact channels

---

## Design Decisions

**No typed commands.** Navigation is click-based. The terminal aesthetic is visual — visitors do not need to know shell syntax to use the portfolio.

**Fixed-height desktop layout.** The dashboard fits the viewport without page scroll on desktop. Mobile scrolls naturally. This is intentional: the product is designed to feel like a workstation, not a document.

**Dither shader on the profile image.** The image is processed frame-by-frame through a WebGL fragment shader that applies ordered dithering, giving it a monochrome terminal-screen quality.

**CRT overlay.** A fixed `pointer-events: none` layer adds scanlines and subtle chromatic aberration without interfering with interaction.

---

<!-- SCREENSHOT: Close-up of dither shader on profile -->
<!-- ![Dither effect](./video-frames/frame-07.jpg) -->

---

## License

MIT — use freely, credit appreciated.

---

<!-- Add live demo link when deployed -->
<!-- **Live:** [jose.sys](https://yoursite.com) -->

<!-- Add contact link -->
<!-- **Contact:** mendoncajose7@gmail.com -->
