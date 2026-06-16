// Sound generator: play note groups with synthesized Tone.js tones (no audio files).
// Playback rules:
//   - intervals: melodic (in sequence) then harmonic (together) per iteration
//   - chords:    all notes simultaneously
//   - scales:    ascending, note-by-note
// The Tone.js audio context must be unlocked by a user gesture before sound plays.
// Browser-only (verified via test.html); depends on Web Audio + CDN Tone.js.

import * as Tone from "tone";
import { sciToTone } from "./pitch.js";

/** Pause between auto-loop repeats, in milliseconds. Single tunable constant. */
export const PAUSE_MS = 2000;

const NOTE_DUR = 0.5; // sounded length of one note, seconds
const STEP = 0.6; // time between successive note onsets, seconds
const CHORD_DUR = 1.0; // sounded length of a chord / harmonic interval, seconds
const HARMONIC_GAP = 0.2; // pause before the harmonic replay in interval mode

let synth = null;
let noteTimers = [];
let loopTimer = null;
let looping = false;

function getSynth() {
  if (!synth) {
    synth = new Tone.PolySynth().toDestination();
  }
  return synth;
}

/** Unlock the audio context. Call from a user-gesture handler (e.g. a click). */
export async function unlock() {
  await Tone.start();
}

/**
 * Play the note group once, following the mode's playback rule.
 * Notes are scheduled with JS timers so playback can be cancelled precisely.
 * @param {object} round a sequence entry: { mode, notes }
 * @returns {number} total playback duration in seconds
 */
export function playSequence(round) {
  const s = getSynth();
  const names = round.notes.map(sciToTone);
  const mode = round.mode ?? round.render;

  if (mode === "chords" || mode === "stacked") {
    s.triggerAttackRelease(names, CHORD_DUR);
    return CHORD_DUR;
  }

  // Sequential melodic playback for scales and intervals.
  names.forEach((name, i) => {
    noteTimers.push(setTimeout(() => s.triggerAttackRelease(name, NOTE_DUR), i * STEP * 1000));
  });
  const melodicEnd = names.length * STEP;

  if (mode === "intervals") {
    // ...then sound both notes together.
    const harmonicAt = (melodicEnd + HARMONIC_GAP) * 1000;
    noteTimers.push(setTimeout(() => s.triggerAttackRelease(names, CHORD_DUR), harmonicAt));
    return melodicEnd + HARMONIC_GAP + CHORD_DUR;
  }

  return melodicEnd;
}

/**
 * Start auto-looping playback with a PAUSE_MS gap between repeats, until
 * stopAutoLoop() is called.
 * @param {object} round
 */
export function startAutoLoop(round) {
  stopAutoLoop();
  looping = true;
  const run = () => {
    if (!looping) return;
    clearNoteTimers();
    const total = playSequence(round);
    loopTimer = setTimeout(run, total * 1000 + PAUSE_MS);
  };
  run();
}

/** Stop the auto-loop and silence any in-flight playback. */
export function stopAutoLoop() {
  looping = false;
  clearNoteTimers();
  if (loopTimer) {
    clearTimeout(loopTimer);
    loopTimer = null;
  }
  if (synth) {
    synth.releaseAll();
  }
}

function clearNoteTimers() {
  noteTimers.forEach(clearTimeout);
  noteTimers = [];
}
