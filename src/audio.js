// Sound generator: play note groups with synthesized Tone.js tones (no audio files).
// Playback rules:
//   - intervals: melodic (in sequence) then harmonic (together) per iteration
//   - chords:    all notes simultaneously
//   - scales:    ascending, note-by-note
// The Tone.js audio context must be unlocked by a user gesture before sound plays.
//
// TODO (milestone 4): implement playback, the auto-loop, and stop().

import * as Tone from "tone";

/** Pause between auto-loop repeats, in milliseconds. Single tunable constant. */
export const PAUSE_MS = 2000;

/** Unlock the audio context. Call from a user-gesture handler. */
export async function unlock() {
  throw new Error("not implemented");
}

/**
 * Play the note group once, following the mode's playback rule.
 * @param {object} round a sequence entry: { mode, notes, durations }
 */
export function playSequence(round) {
  throw new Error("not implemented");
}

/** Start auto-looping playback (PAUSE_MS gap) until stopAutoLoop() is called. */
export function startAutoLoop(round) {
  throw new Error("not implemented");
}

/** Stop the auto-loop and any in-flight playback. */
export function stopAutoLoop() {
  throw new Error("not implemented");
}
