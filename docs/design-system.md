# PRism — Design System

## Colors
--bg:        #030303  (page background)
--surface:   #0f0f0f  (card backgrounds)
--surface2:  #141414  (elevated cards)
--border:    #1e1e1e  (all borders)
--text:      #f0ede5  (primary text)
--muted:     #666666  (secondary text)
--accent:    #ff3d00  (primary accent, CTAs)
--green:     #3ecf8e  (success, safe)
--yellow:    #f5c542  (warning, medium risk)
--red:       #ff3d00  (danger, high risk)
--blue:      #4ecdc4  (info, summary)

## Typography
Display/headings: Bebas Neue (Google Fonts)
Body/UI: Space Grotesk (Google Fonts)
Code: Courier New (system)

Font sizes:
Hero title: clamp(72px, 12vw, 140px)
Section title: clamp(32px, 5vw, 56px)
Card title: 14px Bebas Neue uppercase letter-spacing 3px
Body: 15px
Small/label: 11px uppercase letter-spacing 2px
Code: 12px

## Spacing
Base unit: 8px
Card padding: 28px
Section padding: 80px vertical 24px horizontal
Gap between cards: 16px
Max content width: 900px centered

## Borders & Radius
Border radius: 0 everywhere (brutalist, sharp corners)
Border width: 1px
Border color: --border normally, accent on hover

## Shadows
No box shadows — use border and glow instead
Glow syntax: 0 0 20px rgba(255,61,0,0.3)

## Component Rules
Buttons:
- Primary: bg #ff3d00, color #000, 
  font Bebas Neue, no border-radius
- Hover: bg #ffffff, color #000
- No rounded corners ever

Input fields:
- bg #0a0a0a, border 1px solid #1e1e1e
- focus: border color #ff3d00, 
  box-shadow 0 0 20px rgba(255,61,0,0.2)
- font Space Grotesk, color #f0ede5
- no border-radius

Cards:
- bg #0f0f0f, border 1px solid #1e1e1e
- hover: border color shifts to card accent
- left border 3px solid [card accent color]
- no border-radius