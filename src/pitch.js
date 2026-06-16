// Shared pitch helpers: convert between scientific pitch notation ("C4", "F#4"),
// VexFlow key format ("c/4"), and Tone.js note names ("C4").
// Pure functions — no DOM, no audio. Built first; everything depends on it.

// Letter (A-G), optional accidental (one or two of # or b), then a (possibly
// negative) octave integer. Letter case is normalized; double sharp/flat allowed.
const PITCH_RE = /^([A-Ga-g])(#{1,2}|b{1,2})?(-?\d+)$/;

/**
 * Parse scientific pitch notation into its components.
 * @param {string} sci e.g. "C4", "F#4", "Bb3", "Cbb-1"
 * @returns {{ letter: string, accidental: string, octave: number }}
 *          letter uppercased; accidental "" | "#" | "##" | "b" | "bb"
 * @throws {TypeError} if not a string
 * @throws {Error} if the string is not valid scientific pitch notation
 */
export function parsePitch(sci) {
  if (typeof sci !== "string") {
    throw new TypeError(`Pitch must be a string, got ${typeof sci}`);
  }
  const match = sci.trim().match(PITCH_RE);
  if (!match) {
    throw new Error(`Invalid pitch: "${sci}"`);
  }
  return {
    letter: match[1].toUpperCase(),
    accidental: match[2] ?? "",
    octave: Number(match[3]),
  };
}

/**
 * Convert scientific pitch notation to VexFlow key format.
 * @param {string} sci e.g. "C4", "F#4", "Bb3"
 * @returns {string} e.g. "c/4", "f#/4", "bb/3"
 */
export function sciToVexFlow(sci) {
  const { letter, accidental, octave } = parsePitch(sci);
  return `${letter.toLowerCase()}${accidental}/${octave}`;
}

/**
 * Convert scientific pitch notation to a normalized Tone.js note name.
 * Tone.js already uses scientific notation; this validates and canonicalizes
 * (uppercase letter, no surrounding whitespace).
 * @param {string} sci
 * @returns {string} e.g. "C4", "F#4", "Bb3"
 */
export function sciToTone(sci) {
  const { letter, accidental, octave } = parsePitch(sci);
  return `${letter}${accidental}${octave}`;
}
