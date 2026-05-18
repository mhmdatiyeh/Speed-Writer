# Typing Trainer

A modern, single-page typing-practice app for **English** and **Arabic**.
No backend, no build step, no dependencies, no installation.

---

## How to run

Just **double-click `index.html`** and it opens in your browser. That's it.

The project uses plain HTML, CSS and JavaScript files loaded with `<script>`
tags, so no local server is required.

---

## Features

- Welcome screen with two big language buttons
- 10 random sentences each trial (re-shuffled every time, picked from a 30+ pool)
- Per-character feedback: correct, wrong, current, untyped
- Backspace fully supported, no visible input field on desktop
- Hidden input behind the scenes so mobile soft keyboards still work
- RTL layout and Cairo font for Arabic
- Live per-sentence timer + mistake counter
- Auto-advances to the next sentence
- Beautiful results page: total time, average, mistakes, per-sentence breakdown
- "Train Again" returns to the language picker
- Responsive on desktop and mobile

---

## Project structure

```
Speed writer/
├── index.html               # Markup + script/style includes
├── css/
│   ├── base.css             # design tokens, reset, animations
│   ├── start.css            # welcome screen
│   ├── training.css         # training screen
│   ├── results.css          # results screen
│   └── responsive.css       # media queries
└── js/
    ├── app.js               # composition root - wires everything together
    ├── data/
    │   └── sentences.js     # sentence pool (data only)
    ├── core/
    │   ├── SentenceProvider.js   # picks N random sentences
    │   ├── Timer.js              # measures elapsed time
    │   ├── TypingEngine.js       # typing state machine
    │   └── ResultsTracker.js     # collects per-sentence results
    ├── input/
    │   └── InputController.js    # keyboard + hidden input -> events
    └── ui/
        ├── ScreenManager.js      # show/hide screens
        ├── Renderer.js           # paints sentence as char spans
        ├── StartScreen.js
        ├── TrainingScreen.js
        └── ResultsScreen.js
```

Every JS file attaches its class to a single `window.App` namespace, so files
stay neatly separated while still working without ES modules or a build step.

### SOLID highlights

- **Single Responsibility** — every module has one clear job (data, timing,
  typing logic, rendering, input, screen switching).
- **Open/Closed** — `TypingEngine` exposes `change`, `firstKey`, `complete`
  events. Add behaviors by listening, not by modifying the engine.
- **Liskov / Interface Segregation** — each UI screen exposes only the small
  surface its caller needs.
- **Dependency Inversion** — `app.js` is the only place that knows the concrete
  classes. `SentenceProvider` accepts any pool; `InputController` accepts any
  handlers. Easy to swap or test in isolation.

---

## Sentence rules

- No trailing dot at the end of any sentence.
- Arabic uses only base letters: hamza forms (alef-with-hamza, waw-with-hamza,
  yaa-with-hamza, etc.) are written as their plain bases.
- Each language pool has 30+ entries; 10 are picked at random per trial, so
  consecutive runs feel different.
