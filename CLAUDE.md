# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This is an **ear-training game** web app. As of this writing the repository is **pre-implementation** — only the git repo and this file exist. The architecture below is the agreed design; build it out as described rather than inventing a different structure. Update this file as reality diverges from the plan.

## What this app is

A mobile-sized web page that trains musical ear recognition. The player picks one of three **modes** — **Intervals**, **Chords**, or **Scales** — then plays rounds. Each round:

1. Renders a pre-programmed note group on a treble staff (VexFlow) and plays it with synthesized tones (Tone.js).
2. Offers **3 text-label choices** of the same type as the round (interval names / chord qualities / scale types): one authored-correct answer plus two authored distractors.
3. On selection, highlights the correct choice and reveals a **Next** button.

No score is kept. Rounds are drawn at random (no immediate repeats) from per-mode pools.

## Git workflow (required)

All changes to this project go through git:

- **Never commit directly to `main`.** Create a new feature branch for each change.
- Commit work to that branch as you go, using **clean, descriptive commit messages**.
- A branch is merged into `main` **only when the change is complete, fully tested with all tests passing, and approved by the user.** Do not merge on your own initiative or while any test is failing.

## Hard constraints (do not violate without explicit user approval)

- **No build step for the shipped app.** Plain HTML/CSS/JS using native ES modules (`<script type="module">`), loaded directly in the browser. Do not introduce a bundler for the app itself.
- **Dependencies are CDN-only and limited to VexFlow + Tone.js.** Do not add npm runtime deps. Vitest is allowed strictly as a dev/test dependency (it must not become required to run the app).
- **Synthesized tones only** — Tone.js oscillators/synths, no bundled audio files.
- **Treble clef only** for now, but keep `clef` in the data model so bass can be added later without code changes.
- **Answers are authored, not computed.** Each sequence stores its own correct answer + 2 distractors. There is intentionally no music-theory engine deriving choices.

## Intended architecture

Three conceptual modules (plus shared helpers and a controller):

- **Notation + sound generator** — `src/notation.js` (VexFlow staff rendering, SVG) and `src/audio.js` (Tone.js playback). Pure render / pure playback; no game logic.
- **Sequence data + selector** — `src/sequences.js` (the three authored pools as plain data) and `src/selector.js` (random round pick avoiding immediate repeats, plus choice shuffling). `selector.js` is pure — no DOM/audio.
- **Player display** — `src/game.js`, the controller/state machine: mode-select → round (render + play) → answered (highlight + Next) → next round. Owns all DOM and the audio-loop lifecycle.
- **Shared** — `src/pitch.js`: conversions between scientific pitch notation (`"C4"`, `"F#4"`), VexFlow format (`"c/4"`), and Tone.js note names. Everything depends on this, so build it first.

### Data model

Each pool entry is a self-contained round:

```js
{
  id: "int-maj3-001",
  mode: "intervals",        // "intervals" | "chords" | "scales"
  clef: "treble",
  render: "sequential",     // "sequential" | "stacked"
  notes: ["C4", "E4"],      // scientific pitch notation
  durations: ["q", "q"],    // optional, defaults to quarter notes
  choices: ["Major 3rd", "Minor 3rd", "Perfect 4th"],
  correctIndex: 0
}
```

### Playback rules (live in `audio.js`)

- **Intervals**: play melodic (notes in sequence) **then** harmonic (together) within each loop iteration.
- **Chords**: all notes simultaneously (`render: "stacked"`).
- **Scales**: ascending, single octave, note-by-note (`render: "sequential"`).
- **Replay**: after the first play, auto-loop with a ~2s pause (single tunable `pauseMs` constant), unbounded until answered. A manual "Play again" button is always available. The controller stops the loop the instant an answer is selected; the manual button still works afterward. Loop restarts fresh on Next.
- Tone.js audio context must be unlocked by a user gesture (mode-select tap / first round start) before any sound plays — browsers block audio otherwise.

## Testing

Hybrid strategy:

- **Vitest (Node, dev-only)** for pure logic: `pitch.js` (conversions), `selector.js` (no-repeat selection, choice shuffling, correct-index tracking), and a **`sequences.js` data-validation test** — assert every entry has exactly 3 choices, a valid `correctIndex`, a known mode, parseable pitches, and that `choices[correctIndex]` is the intended answer. This data test is the highest-value guard as content grows.
- **`test.html`** (in-browser, manual/visual) for VexFlow rendering, Tone.js audio, the replay loop (start/stop, manual button, stop-on-answer), and the controller flow — these depend on SVG/Web Audio and aren't meaningfully unit-testable.

Once Vitest is set up, run all tests with `npx vitest`; run a single file with `npx vitest run tests/<name>.test.js`.

## Build order

Follow this dependency order: scaffold (`index.html`, `styles.css`, CDN links) → `pitch.js` + tests → `notation.js` → `audio.js` → `sequences.js` + data-validation test → `selector.js` + tests → `game.js` (wire full flow) → polish → expand content.
