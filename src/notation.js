// Notation renderer: draw a treble staff with a note group using VexFlow (SVG).
// Pure rendering — no game logic, no audio. Browser-only (verified via test.html),
// since it depends on the DOM and the CDN-loaded VexFlow build.

import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from "vexflow";
import { sciToVexFlow } from "./pitch.js";

const HEIGHT = 160;
const MIN_WIDTH = 220;

/**
 * Render a note group onto a target element (cleared first).
 * @param {HTMLElement} targetEl container to render into
 * @param {object} round a sequence entry: { clef, render, notes, durations }
 *        - render "sequential": one note per beat (intervals, scales)
 *        - render "stacked": one chord (chords)
 */
export function renderStaff(targetEl, round) {
  if (!targetEl) {
    throw new Error("renderStaff: targetEl is required");
  }
  const { clef = "treble", render = "sequential", notes = [], durations } = round ?? {};
  if (!Array.isArray(notes) || notes.length === 0) {
    throw new Error("renderStaff: round.notes must be a non-empty array");
  }

  targetEl.innerHTML = "";

  const width = Math.max(MIN_WIDTH, targetEl.clientWidth || 320);
  const renderer = new Renderer(targetEl, Renderer.Backends.SVG);
  renderer.resize(width, HEIGHT);
  const context = renderer.getContext();

  const stave = new Stave(10, 20, width - 20);
  stave.addClef(clef);
  stave.setContext(context).draw();

  const staveNotes =
    render === "stacked"
      ? [makeStaveNote(notes, durations?.[0] ?? "q")]
      : notes.map((n, i) => makeStaveNote([n], durations?.[i] ?? "q"));

  // Soft voice: we don't enforce a strict beat count, so any note count renders.
  const voice = new Voice({ num_beats: 4, beat_value: 4 });
  voice.setStrict(false);
  voice.addTickables(staveNotes);

  new Formatter().joinVoices([voice]).format([voice], width - 60);
  voice.draw(context, stave);
}

/**
 * Build a StaveNote from scientific pitches, attaching accidental glyphs.
 * @param {string[]} sciNotes one pitch (single note) or several (a chord)
 * @param {string} duration VexFlow duration code, e.g. "q", "h", "w"
 */
function makeStaveNote(sciNotes, duration) {
  const keys = sciNotes.map(sciToVexFlow);
  const note = new StaveNote({ keys, duration });
  keys.forEach((key, i) => {
    // key looks like "f#/4" / "bb/3" / "c##/5": accidental = chars between letter and "/".
    const accidental = key.split("/")[0].slice(1);
    if (accidental) {
      note.addModifier(new Accidental(accidental), i);
    }
  });
  return note;
}
