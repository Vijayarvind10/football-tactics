---
direction: Boldness & Clarity
depth: Subtle shadows
spacing_base: 8px
---

# Football Tactics Design System

## Direction
Boldness & Clarity — dark, high-contrast, data-dense. Like a premium analytics terminal that football managers and analysts would use. Every element should communicate precision and authority.

## Color Tokens
- `--bg: #0A0A0A` — page canvas (near-black)
- `--surface-1: #111111` — default cards
- `--surface-2: #161616` — elevated cards, dropdowns
- `--surface-3: #1C1C1C` — modals, tooltips
- `--border: rgba(255,255,255,0.08)` — standard separation
- `--border-strong: rgba(255,255,255,0.14)` — emphasis
- `--text-primary: #F2F2F2`
- `--text-secondary: #A1A1AA`
- `--text-muted: #52525B`
- `--accent: #3B82F6` — primary actions, links
- `--live: #10B981` — live match state
- `--warning: #F59E0B` — yellow cards, alerts
- `--danger: #EF4444` — red cards, errors
- `--pitch: #166534` — SVG pitch green

## Typography
- Headings: Inter, 700 weight, -0.02em letter-spacing
- Body: Inter, 400/500 weight
- Data/Stats: JetBrains Mono, tabular numbers

## Component Patterns
- **Card**: `border-radius: 12px`, `padding: 16px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.4)`, `border: 1px solid var(--border)`
- **Button primary**: `height: 36px`, `padding: 8px 16px`, `radius: 8px`, accent bg
- **Badge (live)**: `height: 20px`, `radius: 9999px`, live green with pulse animation
- **Stat number**: Mono font, 32px bold
- **Pitch SVG**: `--pitch` green bg, `rgba(255,255,255,0.3)` markings

## Spacing
Base: 8px grid. Values: 4, 8, 12, 16, 24, 32, 48, 64

## Depth Strategy
Subtle layered shadows on cards. Pitch component gets 4px/16px shadow for physical presence.
Navigation: same bg as canvas, border-bottom separator (no color difference).
Sidebars/dropdowns: `var(--surface-2)` — one level above canvas.
