# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for **justkeephiking.com**, a Pacific Crest Trail tracking site. The site features a live countdown system, trail stats, and status updates. It's designed to be updated easily via JSON configuration without touching code.

## Architecture

### Core Design: JSON-Driven Static Site

The site uses a **separation of content and code** architecture:

- **Content**: `site/data/site.json` - All dynamic content (stats, status, dates, mode)
- **Presentation**: `site/index.html` - Static structure
- **Styling**: `site/styles.css` - Sierra Sunset color palette theme
- **Logic**: `site/script.js` - Fetches JSON config and renders dynamically

### Key Architectural Decision

The site is intentionally client-side rendered from JSON to enable **dead-simple updates**. When on the trail with limited connectivity, the user can push a single JSON file update via `git` without needing to edit HTML/JS. The script.js includes fallback values if the JSON fetch fails.

### Countdown System

The countdown has **three automatic modes**:

1. **Permit Phase** (`mode: "permit"`):
   - Stage 1: Counts down to general permit release time
   - Stage 2: Automatically switches to personal permit slot time after release
   - Stage 3: Shows "decision time" after slot expires

2. **Start Phase** (`mode: "start"`):
   - Counts down to trail start date at Campo
   - Activated by setting `startDateISO` and changing mode

The logic automatically determines which stage to show based on current time vs. configured timestamps.

### Color Palette: Sierra Sunset

Theme inspired by alpenglow on Sierra peaks:
- Background: Deep twilight purple (`#2a2038`)
- Accent: Warm coral-orange (`#ff7b5f`)
- Text: Sun-bleached cream (`#f5e6d3`)
- Mobile-first responsive design with prominent countdown on small screens

## Deployment Workflow

The site is deployed via GitHub Pages. Any push to `main` goes live:

```bash
git add site/data/site.json
git commit -m "Update trail status"
git push
```

Changes are immediate (users may need cache refresh: Cmd+Shift+R).

## Updating Site Content

**Primary file to edit**: `site/data/site.json`

See `site/data/README.md` for full documentation. Key operations:

### Switch to Trail Mode
```json
{
  "mode": "start",
  "startDateISO": "2026-04-17T07:00:00-07:00",
  ...
}
```

### Update Stats During Hike
```json
{
  "stats": {
    "milesDone": 342,
    "sectionNow": "Sierra",
    "lastCheckin": "2 hours ago",
    "nextTown": "Independence"
  }
}
```

## Code Modification Guidelines

When making code changes (not JSON updates):

- **Preserve simplicity**: This site is meant to be updated from a phone with bad signal
- **Keep client-side**: No build process, no Node dependencies
- **Test JSON fallback**: The hardcoded fallback in `script.js` should always be valid
- **Mobile-first**: Countdown prominence on mobile is critical
- **Color consistency**: Use CSS variables from `:root` for all colors

## File Structure

```
site/
├── index.html          # Static HTML structure
├── styles.css          # Sierra Sunset theme + responsive layout
├── script.js           # JSON fetch + countdown logic + rendering
└── data/
    ├── site.json       # **THE FILE TO EDIT FOR UPDATES**
    └── README.md       # JSON configuration documentation
```
