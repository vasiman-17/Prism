# PRism — Animation Bible

## Library Rules
- ALL transitions: GSAP (not CSS transitions)
- 3D particles: @react-three/fiber useFrame hook
- Easing default: power3.out unless specified
- Never use CSS animation for anything interactive
- CSS animation only for: breathing glow, 
  continuous rotation, infinite loops

## Animation 1 — Hero Mount
Trigger: page load
Sequence (all GSAP timeline):
  0.0s: nothing visible
  0.2s: label tag fades up (y:20→0, opacity:0→1, 0.6s)
  0.5s: title line 1 slides up (y:80→0, opacity:0→1, 0.8s, power4.out)
  0.7s: title line 2 slides up (y:80→0, opacity:0→1, 0.8s, power4.out)
  1.0s: subtitle fades up (y:20→0, opacity:0→1, 0.6s)
  1.2s: input row fades up (y:20→0, opacity:0→1, 0.6s)

## Animation 2 — Input Glow Pulse
Trigger: continuous CSS animation
Input border box-shadow pulses:
  0s: 0 0 0px rgba(255,61,0,0)
  2s: 0 0 24px rgba(255,61,0,0.4)
  4s: 0 0 0px rgba(255,61,0,0)
CSS: animation: glowPulse 4s ease-in-out infinite

## Animation 3 — Scan Sequence
Trigger: user submits PR URL

Phase 1 (0-0.4s): 
  Hero content: opacity 1→0, y:0→-30, duration 0.4s
  Background: fades to #000000, duration 0.4s

Phase 2 (0.4s-0.8s):
  "INITIALIZING PRISM ANALYSIS..." text appears
  Each letter: stagger 0.04s, opacity 0→1, y:10→0

Phase 3 (0.8s onwards):
  Code rain starts — 30 lines, new line every 80ms
  Each line: random x position, opacity 0→0.6→0
  lines move downward at 2px per frame
  Color: #ff3d00, font: Courier New 11px

Phase 4 (0.8s onwards, overlaid):
  Scanner ring: rotates 360deg continuously, 2s per rotation
  Counter: counts 0→100 over estimated backend time
  If backend done before 100%: jump to 100 in 0.3s
  If backend slow: pause counter at 94%

Phase 5 (on backend response):
  Duration: 0.8s total
  0.0s: all elements scale toward center (scale:1→0)
  0.1s: white flash overlay opacity 0→1→0 (0.1s)
  0.2s: screen shake: 
    x oscillates +8,-8,+6,-6,+4,-4,0 over 0.4s
  0.4s: particles burst outward radially
  0.8s: results UI begins appearing

## Animation 4 — Risk Meter Fill
Trigger: results page mount, delay 0.3s
GSAP timeline:
  Bar width: 0% → {risk_score}% 
  Duration: 1.8s, ease: power2.out
  Color updates live as width increases:
    0-30%: #3ecf8e
    30-70%: #f5c542  
    70-100%: #ff3d00
  Glow: box-shadow color matches current fill color
  Number counter: 0 → risk_score, same duration
  If score >80: screen shake when bar completes
    Same shake as Phase 5 but smaller: ±4px

## Animation 5 — Review Cards Entry
Trigger: after risk meter completes
GSAP stagger timeline:
  Card 1: y:40→0, opacity:0→1, delay:0s, duration:0.7s
  Card 2: y:40→0, opacity:0→1, delay:0.15s, duration:0.7s
  Card 3: y:40→0, opacity:0→1, delay:0.3s, duration:0.7s
  Card 4: y:40→0, opacity:0→1, delay:0.45s, duration:0.7s
  Easing: power3.out

## Animation 6 — Text Typewriter
Trigger: each card appears
GSAP: split text by words
Each word: opacity:0→1, y:5→0
Stagger: 0.025s between words
Duration per word: 0.3s

## Animation 7 — Card Hover (3D tilt)
Trigger: mouse enter card
Use JS mousemove on each card:
  Calculate mouse position relative to card center
  Rotate card: rotateX (±8deg), rotateY (±8deg)
  GSAP: duration 0.3s, ease: power2.out
On mouse leave:
  GSAP: rotateX:0, rotateY:0, duration:0.5s

## Animation 8 — Custom Cursor
Two elements: dot (10px) and ring (36px)
Dot: follows mouse exactly via mousemove
Ring: follows with lerp factor 0.12 in RAF loop
On hover interactive elements:
  GSAP: dot scale 1→1.5, fill opacity 0→1
  GSAP: ring scale 1→1.8, opacity 1→0.3
On click:
  Ripple: circle expands from click point
  scale:0→3, opacity:0.6→0, duration:0.5s

## Animation 9 — Particle Field (Three.js)
3000 particles as BufferGeometry Points
Each particle has:
  Base position (random in sphere r=8)
  Phase offset (random 0-2π for sine wave)
  Speed multiplier (random 0.3-1.0)
Per frame (useFrame):
  y position += sin(time * speed + phase) * 0.002
  x position += cos(time * speed * 0.7 + phase) * 0.001
Mouse influence:
  Raycast mouse to z=0 plane
  Each particle within radius 2 of mouse point:
    Drift toward mouse * 0.0015 per frame
    Spring back when mouse leaves: * -0.005

## Timing Reference
Fast micro: 0.2s
Standard: 0.4s  
Dramatic reveal: 0.8s
Scan sequence total: 3-5s
Page transition: 0.4s out + 0.4s in 