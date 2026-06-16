// Shared pitch helpers: convert between scientific pitch notation ("C4", "F#4"),
// VexFlow key format ("c/4"), and Tone.js note names ("C4").
// Pure functions — no DOM, no audio. Built first; everything depends on it.
//
// TODO (milestone 2): implement and unit-test these conversions.

/**
 * Convert scientific pitch notation to VexFlow key format.
 * @param {string} sci e.g. "C4", "F#4", "Bb3"
 * @returns {string} e.g. "c/4", "f#/4", "bb/3"
 */
export function sciToVexFlow(sci) {
  throw new Error("not implemented");
}

/**
 * Convert scientific pitch notation to a Tone.js note name.
 * Tone.js already uses scientific notation, so this mainly normalizes input.
 * @param {string} sci
 * @returns {string}
 */
export function sciToTone(sci) {
  throw new Error("not implemented");
}
